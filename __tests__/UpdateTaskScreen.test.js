import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('<HomeScreen />', () => {
    it('should match snapshot', () => {
        const snap = render(<HomeScreen />).toJSON();
        expect(snap).toMatchSnapshot();
    })
})