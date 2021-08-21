import React, { useState, useEffect } from 'react';
import Firebase from '../config/firebase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/input';

const CreateUser = () => {
  const [tps, setTps] = useState([]);
  const [email, setEmail] = useState('');
  const [userTps, setUserTps] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    Firebase.firestore()
      .collection('tps')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTps(data);
        console.log(data);
      });
  }, []);

  const handleChange = (event) => {
    setUserTps(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        if (email !== '' && password !== '') {
          const response = await Firebase.auth().createUserWithEmailAndPassword(email, password);
          if(response) {
            Firebase.firestore()
              .collection('users')
              .doc(response.user.uid)
              .set({
                tps: userTps,
                createdAt: new Date(),
                editedAt: null
              });
          }
        }
      } catch (error) {
        console.log(error.message);
      }

    setEmail('');
    setPassword('');
  }

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel id="tps-label">TPS</InputLabel>
            <Select
              labelId="tps-label"
              id="tps-id"
              value={userTps}
              onChange={handleChange}
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
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" value={email} required={true} aria-describedby="helper-email" onChange={({target}) => setEmail(target.value)} />
            <FormHelperText id="helper-email">Contoh test@mail.com.</FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" value={password} required={true} aria-describedby="helper-password" onChange={({target}) => setPassword(target.value)} />
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">Simpan</Button>
      </form>
    </div>
  )
}

export default CreateUser;