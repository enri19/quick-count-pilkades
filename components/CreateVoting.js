import React, { useState, useEffect } from 'react';
import Firebase from '../config/firebase';
import { FormControl, InputLabel, Input, FormHelperText, Select, Button, MenuItem, Checkbox, FormLabel, FormGroup, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateVoting = () => {
  const classes = useStyles();
  const [isLoading, setIsloading] = useState(true);
  const [tps, setTps] = useState([]);
  const [village, setVillage] = useState([]);
  const [tpsValue, setTpsValue] = useState('');
  const [villageValue, setVillageValue] = useState('');
  const [candidate, setCandidate] = useState([]);
  const [candidateValue, setCandidateValue] = useState(null);
  const [candidateToSave, setCandidateToSave] = useState([]);

  useEffect(() => {
    Firebase.firestore()
      .collection('village')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVillage(data);
      });
  }, []);

  useEffect(() => {
    Firebase.firestore()
      .collection('tps')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTps(data);
      });
  }, []);

  useEffect(() => {
    Firebase.firestore()
      .collection('candidate')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCandidate(data);
        setIsloading(false);
        // data.map(item => setCandidateValue({ ...candidateValue, [item.id]: false }));
      });
  }, []);

  useEffect(() => {
    if(candidateValue !== null) {
      const keys = Object.keys(candidateValue);
      const filtered = keys.filter(key => {
        return candidateValue[key]
      });

      setCandidateToSave([]);
      filtered.map(item => {
        candidate.map(candidateItem => {
          if(item === candidateItem.id) {
            setCandidateToSave(prevState => [...prevState, {id: item, name: candidateItem.name, voice: 0}]);
          }
        })
      })
    }
  }, [candidateValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    candidateToSave.map(item => {
      Firebase.firestore()
      .collection('voting')
      .add({
        village: villageValue,
        tps: tpsValue,
        candidate: item.id,
        candidateNumber: parseInt(item.serialNumber),
        voice: item.voice,
        createdAt: new Date(),
        editedAt: null
      });
    })
    
    setTpsValue('');
    setVillageValue('');
  }

  const handleChangeTps = (event) => {
    setTpsValue(event.target.value);
  };

  const handleChangeVillage = (event) => {
    setVillageValue(event.target.value);
  };

  const handleChangeCandidate = (event) => {
    setCandidateValue({ ...candidateValue, [event.target.name]: event.target.checked });
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleImageAsFile = (e) => {
  //   const image = e.target.files[0]
  //   setCandidateImage(image);
  // }

  // const handleUpload = () => {
  //   let file = candidateImage;
  //   var storage = fire.storage();
  //   var storageRef = storage.ref();
  //   var uploadTask = storageRef.child('candidate/' + file.name).put(file);
  
  //   uploadTask.on(fire.storage.TaskEvent.STATE_CHANGED,
  //     (snapshot) =>{
  //       var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
  //       setProgress(progress);
  //     },(error) =>{
  //       throw error
  //     },() =>{
  //       uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
  //         setCandidate( prevState => [...prevState, { name: candidateName, image: url, voice: 0 }])
  //       });
  //     })
  // }

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Tambah Voting</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel id="tps-label">Desa</InputLabel>
            <Select
              labelId="tps-label"
              id="tps-id"
              value={villageValue}
              onChange={handleChangeVillage}
            > 
              {
                tps.length !== 0 && village.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel id="tps-label">TPS</InputLabel>
            <Select
              labelId="tps-label"
              id="tps-id"
              value={tpsValue}
              onChange={handleChangeTps}
            > 
              {
                tps.length !== 0 && tps.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Calon</FormLabel>
            <FormGroup>
              {candidate.length !== 0 && candidate.map(item => (
                <FormControlLabel
                  key={item.id}
                  control={<Checkbox onChange={handleChangeCandidate} name={item.id} />}
                  label={item.name}
                />
              ))}
            </FormGroup>
            <FormHelperText>Pilih Calon</FormHelperText>
          </FormControl>
        </div>
        {/* <div>
          {
            candidate.map(item => (
              <>
                <text>{item.name}</text>
                <img src={item.image} alt="image tag" />
              </>
            ))
          }
        </div>
        <div>
          <InputLabel htmlFor="candidate-item">Calon</InputLabel>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Tambah
          </Button>
          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  Calon
                </Typography>
                <Button autoFocus color="inherit" onClick={handleUpload}>
                  Tambah
                </Button>
              </Toolbar>
            </AppBar>
            <form>
              <div>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="candidate-name">Nama Calon</InputLabel>
                  <Input id="candidate-name" value={candidateName} required={true} aria-describedby="helper-candidate-name" onChange={({target}) => setCandidateName(target.value)} />
                </FormControl>
              </div>
              <div>
                <InputLabel htmlFor="candidate-image">Gambar Calon</InputLabel>
                <input type="file" onChange={handleImageAsFile}/>
              </div>
              <div>
                <text>Progress {progress}</text>
              </div>
            </form>
          </Dialog>
        </div> */}
        <Button type="submit" variant="contained" color="primary">Simpan</Button>
      </form>
    </div>
  )
}

export default CreateVoting;