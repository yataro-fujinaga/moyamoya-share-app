import firebase form 'firebase/app';

export default (context) => {
    fetch('/__/firebase/init.json').then(async (response) => {
        firebase.initializeApp(await response.json());
  });
};
