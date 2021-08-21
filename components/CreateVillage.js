import React, { useState } from 'react';
import Firebase from '../config/firebase';
import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';

const CreateVillage = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    Firebase.firestore()
      .collection('village')
      .add({
        name: name,
        year: year,
        createdAt: new Date(),
        editedAt: null
      });

    setName('');
    setYear('');
  }

  return (
    <div>
      <h2>Tambah Desa</h2>
      <form onSubmit={handleSubmit}>
        <div>
           <FormControl>
            <InputLabel htmlFor="name">Nama Desa</InputLabel>
            <Input id="name" value={name} required={true} aria-describedby="helper-name" onChange={({target}) => setName(target.value)} />
            <FormHelperText id="helper-name">Contoh Sukaratu.</FormHelperText>
          </FormControl>
        </div>
        <div>
           <FormControl>
            <InputLabel htmlFor="name">Tahun</InputLabel>
            <Input id="name" value={name} required={true} aria-describedby="helper-name" onChange={({target}) => setYear(target.value)} />
            <FormHelperText id="helper-name">Contoh 2021.</FormHelperText>
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">Simpan</Button>
      </form>
    </div>
  )
}

export default CreateVillage;