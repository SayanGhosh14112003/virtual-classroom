import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  query,
  where,
  and,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid"; 
// Create a root reference
import app from "./firebase";
const provider = new GoogleAuthProvider();
const firebaseAuth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const firebaseContext = createContext();
export default function FirebaseContextProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [spinning, setSpinning] = useState(false);
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth(user);
      } else {
        setAuth(null);
      }
    });
  }, []);
  async function createClass(name, description) {
    try {
      if (!auth) await login();
      else {
        const classDetails = await addDoc(collection(db, "classes"), {
          className: name,
          classDescription: description,
          creatorEmail: auth?.email,
          creatorName: auth?.displayName,
        });
        await addDoc(collection(db, "joinedClass"), {
          className: name,
          classDescription: description,
          creatorEmail: auth?.email,
          creatorName: auth?.displayName,
          classId: classDetails.id,
          memberName: auth?.displayName,
          memberEmail: auth?.email,
          memberPhoto:auth?.photoURL
        });
        //window.location.reload();
      }
    } catch (err) {
      alert(err);
    }
  }
  async function login() {
    try {
      await signInWithPopup(firebaseAuth, provider).then(() =>
        setSpinning(false)
      );
    } catch (err) {
      alert(err);
    }
  }
  async function logout() {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      alert(err);
    }
  }
  async function joinClass(id) {
    try {
      if (!auth) await login();
      else {
        const docRef = doc(db, "classes", id);
        const document = await getDoc(docRef);
        if (document.exists()) {
          console.log(document.data());
          const q = query(
            collection(db, "joinedClass"),
            and(
              where("classId", "==", id),
              where("memberEmail", "==", auth?.email)
            )
          );
          const classDetails = await getDocs(q);
          if (classDetails.size !== 0) {
            alert("You have already Joined The class");
            setSpinning(false);
            return;
          } else {
            await addDoc(collection(db, "joinedClass"), {
              className: document.data().className,
              classDescription: document.data().classDescription,
              creatorEmail: document.data().creatorEmail,
              creatorName: document.data().creatorName,
              classId: document.id,
              memberName: auth?.displayName,
              memberEmail: auth?.email,
              memberPhoto:auth?.photoURL
            });
            setSpinning(false)
           // window.location.reload();
          }
        } else {
          setSpinning(false);
          alert("No Class Found");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getClasses() {
    try {
      if (auth) {
        const q = query(
          collection(db, "joinedClass"),
          where("memberEmail", "==", auth?.email)
        );
        const classes = await getDocs(q);
        return classes;
      }
    } catch (err) {
      alert(err);
    }
  }
  async function getMembers(id){
    try{
      if(auth){
        const q=query(collection(db,'joinedClass'),
        where("classId","==",id)
        );
        const classes=await getDocs(q);
        return classes
      }
    }
    catch(err){
      console.log(err)
    }
  }
  async function leaveClass(classId) {
    try {
      if (auth) {
        const q = query(
          collection(db, "joinedClass"),
          and(
            where("memberEmail", "==", auth?.email),
            where("classId", "==", classId)
          )
        );
        const classes = await getDocs(q);
        classes.forEach(async (e) => {
          await deleteDoc(e.ref);
         // window.location.reload();
        });
      }
    } catch (err) {
      alert(err);
    }
  }
  async function getClassDetails(id) {
    try {
      const ref = doc(db, `classes/${id}`);
      const classRoom = await getDoc(ref);
      return classRoom.data();
    } catch (err) {
      alert(err);
    }
  }
  async function uploadMaterials(file, name, id) {
    try {
      setSpinning(true);
      const fileLoc = `materials/${uuid()}_${file.name}`;
      const Ref = ref(storage, fileLoc);
      await uploadBytes(Ref, file);
      await addDoc(collection(db, `classes/${id}/materials`), {
        title: name,
        filePath: fileLoc,
        time: Timestamp.fromDate(new Date()),
        uploader: auth?.displayName,
        fileId:uuid()
        //save
      });
     // window.location.reload();
      setSpinning(false);
    } catch (err) {
      setSpinning(false);
      alert(err);
    }
  }
  async function uploadSubmission(file, name, id,assignmentId) {
    try {
      setSpinning(true);
      const fileLoc = `submissions/${uuid()}_${file.name}`;
      const Ref = ref(storage, fileLoc);
      await uploadBytes(Ref, file);
      await addDoc(collection(db, `classes/${id}/submissions`), {
        title: name,
        filePath: fileLoc,
        time: Timestamp.fromDate(new Date()),
        uploader: auth?.displayName,
        fileId:uuid(),
        uploaderEmail:auth?.email,
        assignmentId:assignmentId
        //save
      });
     // window.location.reload();
     setSpinning(false);
    } catch (err) {
      setSpinning(false);
      alert(err);
    }
  }
  async function uploadAssignment(file,name,id){
    try{
      setSpinning(true);
      if(typeof(file)==='string'){
        await addDoc(collection(db,`classes/${id}/assignments`),{
          title:name,
          filePath:file,
          time:Timestamp.fromDate(new Date()),
          uploader:auth?.displayName,
          fileId:uuid(),
          quiztype:true
        })
      }else{
        const fileLoc=`assignments/${uuid()}_${file.name}`;
        const Ref=ref(storage,fileLoc);
        await uploadBytes(Ref,file);
        await addDoc(collection(db,`classes/${id}/assignments`),{
          title:name,
          filePath:fileLoc,
          time:Timestamp.fromDate(new Date()),
          uploader:auth?.displayName,
          fileId:uuid(),
          quiztype:false
        })
      }
      setSpinning(false);
      //window.location.reload();
    }catch(err){
      setSpinning(false);
      alert(err)
    }
  }
  async function uploadAnnouncement(name, id) {
    try {
      setSpinning(true);
      //change
      await addDoc(collection(db, `classes/${id}/announcements`), {
        announcement: name,
        time: Timestamp.fromDate(new Date()),
        uploader: auth?.displayName,
        //change
        id:uuid()
      });
      setSpinning(false)
      //window.location.reload();
    } catch (err) {
      setSpinning(false);
      alert(err);
    }
  }
  async function getMaterials(id) {
    try {
      const q = query(
        collection(db, `classes/${id}/materials`),
        orderBy("time", "desc")
      );
      const allFiles = await getDocs(q);
      return allFiles;
    } catch (err) {
      alert(err);
    }
  }
  async function getSubmissions(id,assignmentId,admin) {
    try {
      if(!admin){
        const q = query(
          collection(db, `classes/${id}/submissions`),where("assignmentId", "==", assignmentId),where("uploaderEmail", "==", auth?.email),
          //orderBy("time", "desc")
        );
        const allFiles = await getDocs(q);
       // console.log(allFiles);
        return allFiles;
      }
      else{
        const q = query(
          collection(db, `classes/${id}/submissions`),where("assignmentId", "==", assignmentId),
          //orderBy("time", "desc")
        );
        const allFiles = await getDocs(q);
       // console.log(allFiles);
        return allFiles;
      }
    } catch (err) {
      console.log(err)
      alert(err);
    }
  }
  async function getAssignments(id){
    try{
      const q=query(
        collection(db,`classes/${id}/assignments`),
        orderBy("time","desc")
        );
        const allFiles = await getDocs(q);
     // console.log(allFiles);
      return allFiles;
    }
    catch(err){
      alert(err)
    }
  }
  async function getAnnouncements(id){
    try{
      const q=query(collection(db,`classes/${id}/announcements`),orderBy("time","desc"))
      const allFiles=await getDocs(q)
      return allFiles;

    }
    catch(err){
      alert(err)
    }
  }
  async function getURL(path) {
    try {
      const link = await getDownloadURL(ref(storage, path));
      const headers = {
        'Content-Disposition': 'inline; filename="yourfile"', // This will work for all file types
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      return link;
    } catch (err) {
      alert(err);
    }
  }
  async function deleteFile(id, path,fileId) {
    try {
      setSpinning(true);
      const fileRef = ref(storage, path);
      const q = query(
        collection(db, `classes/${id}/materials`),
        where("fileId", "==", fileId)
      );
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
        await deleteObject(fileRef)
        //window.location.reload();
      });
      await Promise.all(promises);
      setSpinning(false)
    } catch (err) {
      setSpinning(false);
      alert(err);
    }
  }
  async function updateFile(id,name,fileId){
    try{
      setSpinning(true);
      const q=query(collection(db,`classes/${id}/materials`),where("fileId",'==',fileId));
      const querySnapshot=await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
        await setDoc(doc.ref, { title: name }, { merge: true });
      });
      
      await Promise.all(promises);
      setSpinning(false);
    }
    catch(err){
      setSpinning(false);
      alert(err)
    }
  }
  async function updateAnnouncement(id,name,fileId){
    try{
      setSpinning(true);
      const q=query(collection(db,`classes/${id}/announcements`),where('id','==',fileId));
      const querySnapshot=await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
        await setDoc(doc.ref, { announcement: name }, { merge: true });
      });
      
      await Promise.all(promises);
      setSpinning(false);
    }
    catch(err){
      setSpinning(false);
      alert(err)
    }
  }
  async function updateAssignment(id,name,fileId){
    try{
      setSpinning(true);
      const q=query(collection(db,`classes/${id}/assignments`),where('fileId','==',fileId));
      const querySnapshot=await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
        await setDoc(doc.ref, { title: name }, { merge: true });
      });
      
      await Promise.all(promises);
      setSpinning(false);
    }
    catch(err){
      setSpinning(false);
      alert(err)
    }
  }
  async function deleteAssignment(id,path,fileId){
    try{
      setSpinning(true);
      /*if(path){
        const fileRef=ref(storage,path);
        await deleteObject(fileRef)
      }*/
      const q = query(
        collection(db, `classes/${id}/assignments`),
        where("fileId", "==", fileId)
      );
      const querySnapshot = await getDocs(q);
     // querySnapshot.forEach(async (doc) => {
      const promises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
        //delete submissions
        //window.location.reload();
      });
      await Promise.all(promises);
      setSpinning(false);
    }catch(err){
      setSpinning(false);
      alert(err);
    }
  }
  async function deleteSubmission(id,path,fileId){
    try{
      setSpinning(true);
      const fileRef=ref(storage,path);
      const q = query(
        collection(db, `classes/${id}/submissions`),
        where("fileId", "==", fileId)
      );
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
     // querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        await deleteObject(fileRef)
        //delete submissions
        // window.location.reload();
      });
      await Promise.all(promises);
      setSpinning(false)
    }catch(err){
      setSpinning(false);
      alert(err);
    }
  }
  async function deleteAnnouncement(id,fileId){
    try{
      setSpinning(true);
      const q = query(
        collection(db, `classes/${id}/announcements`),
        where("id", "==", fileId)
      );
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
      //querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        //window.location.reload();
      });
      await Promise.all(promises);
      setSpinning(false)
    }
    catch(err){
      alert(err)
      setSpinning(false)
    }
  }
  return (
    <firebaseContext.Provider
      value={{
        auth,
        login,
        logout,
        createClass,
        joinClass,
        getClasses,
        leaveClass,
        setSpinning,
        spinning,
        getClassDetails,
        uploadMaterials,
        uploadAnnouncement,
        getMaterials,
        getURL,
        deleteFile,
        getAnnouncements,
        deleteAnnouncement,
        uploadAssignment,
        getAssignments,
        deleteAssignment,
        uploadSubmission,
        getSubmissions,
        deleteSubmission,
        getMembers,
        updateFile,
        updateAnnouncement,
        updateAssignment
      }}>
      {children}
    </firebaseContext.Provider>
  );
}
export function useAuth() {
  return useContext(firebaseContext);
}
