import React from 'react';

import { userService, authenticationService } from '@/_services';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser._doc.userid).then(userFromApi =>  {
            this.setState({ userFromApi })
            console.log("dasdad",this.state.userFromApi)
                
        });
        console.log("hddhjadj",currentUser)
        
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h1>Home</h1>
                <p>You're logged in with React & JWT!!</p>
                <p>Your role is: <strong>{currentUser._doc.role}</strong>.</p>
                <p>This page can be accessed by all authenticated users.</p>
                <div>
                    Current user from secure api end point:
                    {userFromApi &&
                        <ul>
                            <li>{userFromApi.firstName} {userFromApi.lastName}</li>
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export { HomePage };