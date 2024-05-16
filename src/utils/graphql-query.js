import gql from "graphql-tag";

export const USER_BYID_QUERY = gql`
    query getUserById($id: Int!) {
        getUserById(id: $id) {
            id
            username
            email
            lastName
            firstName
            phone
            about
            role {
                id
                name
            }
        }
    }
`;

export const ALLUSER_QUERY = gql`
    query allUser($filterInput: UserFilter) {
        allUser(filterInput: $filterInput) {
            id
            username
            email
            lastName
            firstName
            phone
            role {
                id
                name
            }
        }
    }
`;

export const COURSE_BYID_QUERY = gql`
    query getCourseById($id: Int!) {
        getCourseById(id: $id) {
            id
            name
            description
            startDate
            endDate
            instructor {
                id
                firstName
                lastName
            }
            groups {
                id
                name
                students {
                    id
                    firstName
                    lastName
                }
            }
            students {
                id
                firstName
                lastName
                phone
                email
            }
        }
    }
`;

export const STUDENT_BYCOURSEID_QUERY = gql`
    query getCourseById($id: Int!) {
        getCourseById(id: $id) {
            id
            students {
                id
                firstName
                lastName
            }
        }
    }
`;

export const ALLCOURSE_QUERY = gql`
    query allCourse($filterInput: CourseFilter) {
        allCourse(filterInput: $filterInput) {
            id
            name
            startDate
            endDate
            instructor {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

export const ALLCOURSE_NAME_QUERY = gql`
    query allCourse($filterInput: CourseFilter) {
        allCourse(filterInput: $filterInput) {
            id
            name
        }
    }
`;

export const ALLASSIGNMENT_QUERY = gql`
    query allAssignment($filterInput: AssignmentFilter) {
        allAssignment(filterInput: $filterInput) {
            id
            name
            dueDate
            course {
                id
                name
                instructor {
                    id
                    lastName
                    firstName
                }
            }
        }
    }
`;

export const ASSIGNMENT_BYID_QUERY = gql`
    query getAssignmentById($id: Int!) {
        getAssignmentById(id: $id) {
            id
            name
            dueDate
            description
            attachments {
                id
                name 
                extension
                size
                attachmentBase64
            }
            course {
                id
                name
                instructor {
                    id
                    firstName
                    lastName
                }
            }
            studentAssignments {
                status
                assignedFor {
                    id
                    name
                    students {
                        id
                        firstName
                        lastName
                        schoolId
                    }
                }
            }
        }
    }
`;

export const ASSIGNMENTASSIGN_BYASSIGNMENTID_QUERY = gql`
    query getAssignmentById($id: Int!) {
        getAssignmentById(id: $id) {
            id
            name
            course {
                id
                name
                instructor {
                    id
                    firstName
                    lastName
                }
            }
            groups {
                id
                name
            }
        }
    }
`;

export const ALLSTUDENTASSIGNMENT_QUERY = gql`
    query allStudentAssignment($filterInput: AssignmentFilter) {
        allStudentAssignment(filterInput: $filterInput) {
            id
            status
            assignment {
                id
                name 
                dueDate
                course {
                    id
                    name
                }
            }
            
        }
    }
`;

export const STUDENTASSIGNMENT_BYID_QUERY = gql`
    query getStudentAssignmentById($id: Int!) {
        getStudentAssignmentById(id: $id) {
            id
            url
            submitAt
            status
            assignedBy {
                id
                lastName
                firstName
            }
            assignment {
                id
                name 
                description
                dueDate
                attachments {
                    id
                    name
                    extension
                    size
                    attachmentBase64
                }
                course {
                    id
                    name
                    instructor {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

export const ALLASSIGNMENTQUESTION_QUERY = gql`
    query allAssignmentQuestion($id: Int!) {
        allAssignmentQuestion(id: $id) {
            id
            generatedText
            overwriteText
            helpText
            isAssigned
            studentAssignment {
                id
            }
            questionComment {
                id
                text
                createdOn
                creator {
                    id
                    firstName
                    lastName
                }
            }
        }
    }
`;

export const ALLANALYZER_QUERY = gql`
    query allAnalyzer {
        allAnalyzer {
            id
            name 
            description
            developer {
                id
                lastName
                firstName
            }
        }
    }
`;

export const ANALYZER_BYID_QUERY = gql`
    query getAnalyzerById($id: Int!) {
        getAnalyzerById(id: $id) {
            id
            name 
            description
            analyzerBase64
            analyzerFileName
            analyzerFileExtension
            analyzerFileSize
            developer {
                id
                firstName
                lastName
                phone
                email
            }
        }
    }
`;



