import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
// import { HeaderComponent } from './app/header/header.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
// bootstrapApplication(HeaderComponent)
//which component we wanna start our angular app
//and if we use module we do not start our app like this

//_______________________________________________________


// import { platformBrowser } from '@angular/platform-browser';
// import { BrowserModule } from '@angular/platform-browser';