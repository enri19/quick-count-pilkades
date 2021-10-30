import React from 'react';
import update from 'react-addons-update';
import Firebase from '../config/firebase';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    padding: '0 20px',
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
  },
  textHead: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "36px"
  },
  textSub: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "red"
  },
  candidateContent: {
    padding: '0 20px'
  },
  candidateItem: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: "#fff"
  },
  candidateImage: {
    width: '100%'
  },
  listItem: {
    margin: "0 0 10px 0",
    borderRadius: "15px"
  },
  bg0: {
    backgroundColor: "#181A18"
  },
  bg1: {
    backgroundColor: "#FF2442"
  },
  bg2: {
    backgroundColor: "#FFB830"
  },
  bg3: {
    backgroundColor: "#3DB2FF"
  },
})

class App extends React.Component{
  constructor(props) {
    super(props);
    this.charts = [];
    this.state = {
      charts: [],
      tps: [],
      candidate: [],
      voices: [],
      options: [],
      isLoading: true,
    };
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

	componentDidMount(){
    Firebase.firestore()
      .collection('tps')
      .orderBy('name')
      .get()
      .then(snap => {
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.setState({
          tps: data
        }, () => {
          let newVoices = [];

          this.state.tps.forEach(item => {
            this.unsubscribe = Firebase.firestore()
              .collection('voting')
              .where('tps', '==', item.id)
              .orderBy('candidateNumber')
              .onSnapshot(snap => {
                let type;
                const tps = item.id;
                const labels = [];
                const datasets =  [
                  {
                    label: [item.location],
                    backgroundColor: ['#181A18', '#FF2442', '#FFB830', '#3DB2FF'],
                    borderColor: '#FFD371',
                    borderWidth: 1,
                    data: []
                  }
                ]

                const newOption = {
                  animation: false,
                  scale: {
                    ticks: {
                      precision: 0
                    }
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: parseInt(item.ballot),
                    }
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: item.name,
                      padding: 0
                    },
                    subtitle: {
                      display: true,
                      text: `${item.location} (Total DPT ${item.ballot})`,
                      padding: 10
                    },
                    datalabels: {
                      display: true,
                      color: '#000000',
                      align: 'end',
                      anchor: 'end',
                      font: { size: '14' }
                    },
                    legend: {
                      display: false,
                    }
                  },
                }

                this.setState(prevState => ({
                  options: [...prevState.options, newOption]
                }));

                snap.docChanges().forEach((change) => {
                  if (change.type === "added") {
                    type = 'added';
                    labels.push(change.doc.data().candidateName);
                    datasets[0].data.push(change.doc.data().voice);

                    if(newVoices.some(item => item.id == change.doc.data().candidate)) {
                      newVoices.map(item => {
                        if(item.id === change.doc.data().candidate) {
                          item.voice = item.voice + change.doc.data().voice;
                        }
                      })
                    } else {
                      newVoices.push({
                        id: change.doc.data().candidate,
                        voice: change.doc.data().voice
                      });
                    }
                  }

                  if (change.type === "modified") {
                    type = 'modified';
                    const {
                      charts
                    } = this.state
                    const candidateName = change.doc.data().candidateName.toString().toLowerCase();
                    const tpsIdx = this.state.charts.findIndex(chart => chart.tps === tps);
                  
                    charts.forEach(chart => {
                      if(chart.tps === change.doc.data().tps) {
                        const idx = chart.labels.findIndex(label => label.toString().toLowerCase() === candidateName);

                        // const newChart = this.charts[change.doc.data().tps];
                        // newChart.data.datasets[0].data[idx] = change.doc.data().voice;
                        // newChart.update();

                        this.setState({
                          charts: update(this.state.charts, {[tpsIdx]: {datasets: {0: {data: {[idx]: {$set: change.doc.data().voice}}}}}}),
                        });
                      }
                    });

                    const candidateIdx = this.state.voices.findIndex(voice => voice.id === change.doc.data().candidate);
                    this.setState({
                      voices: update(this.state.voices, {[candidateIdx]: {voice: {$set: this.state.voices[candidateIdx].voice + 1}}})
                    });
                  }
                });

                if(type === 'added') {
                  this.setState(prevState => ({
                    charts: [...prevState.charts, { tps: tps, labels: labels, datasets: datasets}],
                    voices: newVoices
                  }), () => {
                    this.setState({
                      isLoading: false
                    })
                  });
                }
              })
          })
        });
      });

    Firebase.firestore()
      .collection('candidate')
      .orderBy('serialNumber', 'asc')
      .get()
      .then(snap => {
        snap.forEach((doc) => {
          this.setState(prevState => ({
            candidate: [...prevState.candidate, {id: doc.id, ...doc.data()}]
          }), () => {
            console.log(this.state.candidate)
          });
        })
      })
	}

	render() {
    const { classes } = this.props;
    const getColor = (serialNumber) => {
      if(serialNumber === -1) {
        return classes.bg0;
      }
      if(serialNumber === 0) {
        return classes.bg1;
      }
      if(serialNumber === 1) {
        return classes.bg2;
      }
      if(serialNumber === 2) {
        return classes.bg3;
      }
    }

    if(this.state.isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <h2 className={classes.textHead}>Real Count Pilkades Sukaratu Tahun 2021</h2>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <Grid className={classes.candidateContent} container spacing={3}>
              <List className={classes.candidateItem}>
                { this.state.candidate.length !== 0 &&  this.state.candidate.map(data => (
                  <ListItem className={classes.listItem} classes={{ root: getColor(data.serialNumber) }} key={data.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <img className={classes.candidateImage} src={data.image} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<b>{data.name}</b>}
                      secondary={<Typography variant="h4" style={{ color: '#fff' }}>
                        {this.state.voices.find(item => item.id === data.id).voice}
                      </Typography>}
                    />
                  </ListItem>
                  ))
                }
              </List>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            <Grid container spacing={3}>
              { this.state.charts.map((data, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Bar
                      ref={chart => this.charts[data.tps] = chart}
                      data={data}
                      plugins={[ChartDataLabels]}
                      options={this.state.options[idx]}
                      height={300}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
	}
}

export default withStyles(styles, { withTheme: true })(App);
