import React, { useState } from 'react';
import Firebase from '../config/firebase';
import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';

const CreateCandidate = () => {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [progress, setProgress] = useState('0');

  const handleSubmit = async (event) => {
    event.preventDefault();

    Firebase.firestore()
      .collection('candidate')
      .add({
        name: name,
        serialNumber: parseInt(serialNumber),
        image: imageUrl,
        voice: 0,
        createdAt: new Date(),
        editedAt: null
      });

    setName('');
    setImageUrl('');
  }

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImage(image);

    console.log(image)
  }

  const handleUpload = () => {
    let file = image;
    var storage = Firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef.child('candidate/' + file.name).put(file);
  
    uploadTask.on(Firebase.firebase_.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>{
        var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
        setProgress(progress);
      },(error) =>{
        throw error
      },() =>{
        uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
          setImageUrl(url);
        });
      })
  }

  return (
    <div>
      <h2>Tambah Calon</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="candidate-name">Nama Calon</InputLabel>
            <Input id="candidate-name" value={name} required={true} aria-describedby="helper-candidate-name" onChange={({target}) => setName(target.value)} />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="candidate-serial-number">Nomor Urut</InputLabel>
            <Input id="candidate-serial-number" value={serialNumber} required={true} aria-describedby="helper-candidate-serial-number" onChange={({target}) => setSerialNumber(target.value)} />
          </FormControl>
        </div>
        <div>
          <InputLabel htmlFor="candidate-image">Gambar Calon</InputLabel>
          <img src={imageUrl} alt="image tag" />
          <input type="file" onChange={handleImageAsFile}/>
        </div>
        <div>
          <Button autoFocus variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
          <text>Progress {progress}</text>
        </div>
        <Button type="submit" variant="contained" color="primary">Simpan</Button>
      </form>
    </div>
  )
}

export default CreateCandidate;