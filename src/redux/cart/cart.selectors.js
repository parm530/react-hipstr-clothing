import { createSelector } from 'reselect';

// input selector - doesnt use createSelector
// output selector - uses inoutSelector and createSelector to build themselves

// INPUT SELECTORS
// function that uses a name structure like selectSomething
// recieves the whole state, but returns a slice of it 
const selectCart = state => state.cart;

export const selectCartItems = createSelector(
    [selectCart],
    (cart) => cart.cartItems
);

export const selectCartItemsCount = createSelector(
    [selectCartItems],
    cartItems =>
        cartItems.reduce(
            (accQuantity, cartItem) => accQuantity + cartItem.quantity
        , 0)

)

