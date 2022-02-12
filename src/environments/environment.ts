// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'quizme-3318d',
    appId: '1:765677911409:web:227dd10fb88d9b333f0ad0',
    storageBucket: 'quizme-3318d.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyA5LLUONaAOyx1pYF0GE0dBNrlnB0sGyIM',
    authDomain: 'quizme-3318d.firebaseapp.com',
    messagingSenderId: '765677911409',
    measurementId: 'G-559HNJR8ZF',
  },
  production: true,
  firebaseCollections: {
    users: 'user-collection',
    helpMessages: 'users-helps-messages',
    quiz: 'quiz-collection',
  },
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
