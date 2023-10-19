import React, {useState} from 'react';
import {ReactSession} from 'react-client-session';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {Button, TextField} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Service from '../Service';
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';

//
//       Component: Feature
//       Description: This component is the specific feature which has the up and down votes
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Comment = ({comment, index}) => {
  console.log(comment.comment);
  const username = ReactSession.get('username');
  const loggedin = username !== '' && username !== undefined ? true : false;

  const [open, setOpen] = React.useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // ADD DATA TESTID
  return (
    <div className="child feature">
      <div className="comment-container">
        <div className="content">
          <div className="feature-content" data-testid={'feature_content:'}>
            <span style={{marginTop: 'auto', marginBottom: 'auto'}}>
              <h5>
                {comment.email} commented <br></br>
              </h5>
            </span>

            <span style={{marginTop: 'auto', marginBottom: 'auto'}}>
              {comment.comment}
            </span>
            {/* <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            {comment.timestamp}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
