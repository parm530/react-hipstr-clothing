import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import CheckoutPage from './pages/checkout/checkout.component';

import { selectCurrentUser } from './redux/user/user.selectors';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';
import FormInput from './components/form-input/form-input.component';

 class App extends React.Component {
	unsubscribeFromAuth = null

	componentDidMount() {
		const { setCurrentUser } = this.props;

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
					// this.setState({
					// 	currentUser: {
					// 		id: snapshot.id,
					// 		...snapshot.data()
					// 	}
					// });

					setCurrentUser({
						id: snapshot.id,
						...snapshot.data()
					});
				});
			} else {
				setCurrentUser(userAuth);
			}
		});
	}
	
	componentWillUnmount() {
		// closes the subscription
		this.unsubscribeFromAuth();
	}

	render() {
		return (
			<div>
				<Header /> 
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route path='/shop' component={ShopPage} />
					<Route exact path='/checkout' component={CheckoutPage} />
					<Route 
						exact 
						path='/sign-in' 
						render={() =>
							this.props.currentUser ? (
								<Redirect to='/' />
							) : (
								<SignInAndSignUp />
							)
						}
					/>
				</Switch> 
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({
	currentUser: selectCurrentUser 
})

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(App);
