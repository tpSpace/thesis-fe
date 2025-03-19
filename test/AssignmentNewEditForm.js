import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import AssignmentNewEditForm from '../src/sections/@app/assignment/AssignmentNewEditForm';

// Mock the dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@apollo/client', () => ({
  useMutation: () => [jest.fn().mockResolvedValue({ data: { upsertAssignment: {} } }), { loading: false }],
  useQuery: () => ({
    loading: false,
    data: {
      allCourse: [
        { id: 1, name: 'Course 1' },
        { id: 2, name: 'Course 2' },
      ],
    },
    error: null,
  }),
}));

// Mock the RHFEditor component
jest.mock('../src/components/hook-form/RHFEditor', () => ({
  __esModule: true,
  default: ({ name }) => <div data-testid={`mock-editor-${name}`}>Mock Rich Text Editor</div>,
}));

// Mock file uploads
jest.mock('../src/components/hook-form/RHFUploadMultiFile', () => ({
  __esModule: true,
  default: ({ name }) => <div data-testid={`mock-upload-${name}`}>Mock File Upload</div>,
}));

// Create mock theme
const mockTheme = createTheme({
  customShadows: {
    z20: '0 8px 16px 0 rgba(0, 0, 0, 0.24)',
  },
  palette: {
    primary: { main: '#1976d2' },
    background: { neutral: '#f5f5f5' },
  },
  typography: {
    subtitle2: {
      fontWeight: 600,
    },
  },
  shape: { borderRadius: 8 },
});

const TestWrapper = ({ children }) => (
  <ThemeProvider theme={mockTheme}>
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  </ThemeProvider>
);

describe('AssignmentNewEditForm', () => {
  test('renders create assignment form', () => {
    render(
      <TestWrapper>
        <AssignmentNewEditForm />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-editor-description')).toBeInTheDocument();
    expect(screen.getByLabelText(/Course/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Assignment/i)).toBeInTheDocument();
  });
  
  test('renders edit form with prefilled values', () => {
    const mockAssignment = {
      id: 1,
      name: 'Test Assignment',
      description: '<p>Test Description</p>',
      dueDate: '2025-05-15T00:00:00.000Z',
      course: { id: 1 },
      attachments: []
    };

    render(
      <TestWrapper>
        <AssignmentNewEditForm isEdit assignment={mockAssignment} />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test Assignment');
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
  });
});