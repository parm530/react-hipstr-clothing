import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';

 class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currentUser: null
		}
	}

	unsubscribeFromAuth = null

	componentDidMount() {
		// opens a subscription to firebase
		// to notify our app when a user has logged in or logged out
		this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
			// this.setState({ currentUser: user});
			// createUserProfileDocument(user);
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);

				// if the snapshot has changed
				// .onSnapshot listens for changes
				userRef.onSnapshot( snapshot => {
					// snapshot current state of the userRef object
					this.setState({
						currentUser: {
							id: snapshot.id,
							...snapshot.data()
						}
					});
					console.log(this.state);
				});
			}

			this.setState({ currentUser: userAuth });
		});
	}
	
	componentWillUnmount() {
		// closes the subscription
		this.unsubscribeFromAuth();
	}

	render() {
		return (
			<div>
				<Header currentUser={this.state.currentUser}/>
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route path='/shop' component={ShopPage} />
					<Route path='/sign-in' component={SignInAndSignUp} />
				</Switch>
			</div>
		);
	}
}

export default App;
