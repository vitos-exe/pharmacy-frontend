import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FormGroup from "../../components/utils/FormGroup";

describe('FormGroup', () => {
    it('renders the component correctly', () => {
        const props = {
            field: 'email',
            required: true,
            changeState: jest.fn(),
        };

        const { getByLabelText } = render(<FormGroup {...props} />);

        // Assert label text
        expect(getByLabelText('Email')).toBeInTheDocument();

        // Assert input type
        expect(getByLabelText('Email')).toHaveAttribute('type', 'email');

        // Assert required attribute
        expect(getByLabelText('Email')).toBeRequired();
    });

    it('handles input change correctly', () => {
        // Simulate useState
        let state = {'email': 'test@example.com'};
        const setState = jest.fn(func => {
            state = func(state)
        });

        const props = {
            field: 'email',
            required: true,
            changeState: setState
        };

        const { getByLabelText } = render(<FormGroup {...props} />);

        const input = getByLabelText('Email');
        const testValue = 'test2@example.com';

        // Simulate input change
        fireEvent.change(input, { target: { value: testValue } });

        // Assert that changeState function is called with the correct value
        expect(setState).toHaveBeenCalledTimes(1);
        expect(state).toEqual({'email': 'test2@example.com'});
    });

    it('renders password input for "confirm-password" field', () => {
        const props = {
            field: 'confirm-password',
            required: true,
            changeState: jest.fn(),
        };

        const { getByLabelText } = render(<FormGroup {...props} />);

        // Assert input type
        expect(getByLabelText('Confirm-password')).toHaveAttribute('type', 'password');
    });

    it('renders text input for other fields', () => {
        const props = {
            field: 'username',
            required: true,
            changeState: jest.fn(),
        };

        const { getByLabelText } = render(<FormGroup {...props} />);

        // Assert input type
        expect(getByLabelText('Username')).toHaveAttribute('type', 'text');
    });
});
