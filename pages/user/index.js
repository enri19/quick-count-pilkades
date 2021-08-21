// import CreateUser from '../../components/CreateUser';

// const User = () => {
//   // const [users, setUsers] = useState([]);
//   // useEffect(() => {
//   //   fire.firestore()
//   //     .collection('user')
//   //     .onSnapshot(snap => {
//   //       const users = snap.docs.map(doc => ({
//   //         id: doc.id,
//   //         ...doc.data()
//   //       }));

//   //       console.log(users);

//   //       setUsers(users);
//   //     });
//   // }, []);

//   return (
//     <div>
//       {/* <Head>
//         <title>User</title>
//       </Head>
//       <h1>User</h1>
//       <ul>
//         {users.length !== 0 && users.map(user =>
//           <li key={user.id}>
//             {blog.userName}
//           </li>
//         )}
//       </ul> */}
//       <CreateUser />
//     </div>
//   )
// }

// export default User;

import CreateUser from '../../components/CreateUser';

const User = () => {

  return (
    <div>
      <CreateUser />
    </div>
  )
}

export default User;