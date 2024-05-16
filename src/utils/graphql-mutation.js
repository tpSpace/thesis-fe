import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
    mutation logIn($userInput: UserLogIn!) {
        logIn(userInput: $userInput) {
            token
            user {
                id
                username
                lastName
                firstName
                email
                phone
                about
                role {
                    id
                    name
                }
            }
        }
    }
`;

export const SIGNUP_MUTATION = gql`
    mutation signUp($userInput: UserSignUp!) {
        signUp(userInput: $userInput) {
            token
            user {
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
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation logOut {
        logOut
    }
`;

export const REFRESHJWT_MUTATION = gql`
    mutation refreshJWT {
        refreshJWT {
            token
            user {
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
    }
`;

export const UPSERTUSER_MUTATION = gql`
    mutation upsertUser($userInput: UserUpsert!) {
        upsertUser(userInput: $userInput) {
            id
            username
            email
            phone
            about
            lastName
            firstName
            role {
                id
                name
            }
        }
    }
`;

export const CHANGEPASSWORD_MUTATION = gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) 
    }
`;

export const UPSERTCOURSE_MUTATION = gql`
    mutation upsertCourse($courseInput: CourseUpsert!) {
        upsertCourse(courseInput: $courseInput) {
            id
        }
    }
`;

export const REGISTERCOURSE_MUTATION = gql`
    mutation registerCourse($studentId: [Int!], $courseId: Int!) {
        registerCourse(studentId: $studentId, courseId: $courseId)
    }
`;

export const REGISTERGROUP_MUTATION = gql`
    mutation registerGroup($name: String!, $studentId: [Int!], $courseId: Int!) {
        registerGroup(name: $name, studentId: $studentId, courseId: $courseId)
    }
`;

export const ASSIGNASSIGNMENT_MUTATION = gql`
    mutation assignAssignment($assignmentId: Int!, $groupId: [Int!]) {
        assignAssignment(assignmentId: $assignmentId, groupId: $groupId)
    }
`;

export const UPSERTASSIGNMENT_MUTATION = gql`
    mutation upsertAssignment($assignmentInput: AssignmentUpsert!) {
        upsertAssignment(assignmentInput: $assignmentInput)
    }
`;

export const SUBMITASSIGNMENT_MUTATION = gql`
    mutation submitAssignment($assignmentId: Int!, $url: String!) {
        submitAssignment(assignmentId: $assignmentId, url: $url)
    }
`;

export const ASSIGNQUESTION_MUTATION = gql`
    mutation assignQuestion($questionId: Int!, $overwriteText: String!) {
        assignQuestion(questionId: $questionId, overwriteText: $overwriteText)
    }
`;

export const POSTCOMMENT_MUTATION = gql`
    mutation postComment($questionId: Int!, $text: String!) {
        postComment(questionId: $questionId, text: $text)
    }
`;

export const UPSERTANALYZER_MUTATION = gql`
    mutation upsertAnalyzer($analyzerInput: AnalyzerUpsert!) {
        upsertAnalyzer(analyzerInput: $analyzerInput)
    }
`;