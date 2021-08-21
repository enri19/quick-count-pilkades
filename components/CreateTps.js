import React, { useState } from 'react';
import Firebase from '../config/firebase';
import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';

const CreateTps = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rtrw, setRtrw] = useState('');
  const [ballot, setBallot] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    Firebase.firestore()
      .collection('tps')
      .add({
        name: name,
        location: location,
        rtrw: rtrw,
        ballot: ballot,
        createdAt: new Date(),
        editedAt: null
      });

    setName('');
    setLocation('');
    setRtrw('');
    setBallot('');
  }

  return (
    <div>
      <h2>Tambah TPS</h2>
      <form onSubmit={handleSubmit}>
        <div>
           <FormControl>
            <InputLabel htmlFor="name">Nama TPS</InputLabel>
            <Input id="name" value={name} required={true} aria-describedby="helper-name" onChange={({target}) => setName(target.value)} />
            <FormHelperText id="helper-name">Contoh TPS 01.</FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl>
            <InputLabel htmlFor="location">Lokasi</InputLabel>
            <Input id="location" value={location} required={true} aria-describedby="helper-name" onChange={({target}) => setLocation(target.value)} />
            <FormHelperText id="helper-name">Contoh Kp. Cibuah.</FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl>
            <InputLabel htmlFor="rtrw">RT/RW</InputLabel>
            <Input id="rtrw" value={rtrw} required={true} aria-describedby="helper-name" onChange={({target}) => setRtrw(target.value)} />
            <FormHelperText id="helper-name">Contoh 001/001.</FormHelperText>
          </FormControl>
        </div>
        <div>
           <FormControl>
            <InputLabel htmlFor="name">Surat Suara</InputLabel>
            <Input id="name" value={ballot} aria-describedby="helper-name" onChange={({target}) => setBallot(target.value)} />
            <FormHelperText id="helper-name">Contoh 320.</FormHelperText>
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">Simpan</Button>
      </form>
    </div>
  )
}

export default CreateTps;