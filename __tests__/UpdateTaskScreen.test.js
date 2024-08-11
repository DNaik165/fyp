import React from 'react';
import { render } from '@testing-library/react-native';
import UpdateTaskScreen from '../screens/UpdateTaskScreen';

describe('<UpdateTaskScreen />', () => {
    it('should match snapshot', () => {
        const snap = render(<UpdateTaskScreen />).toJSON();
        expect(snap).toMatchSnapshot();
    })
})