import React from 'react';
import ReactDom from 'react-dom';
import * as _ from 'lodash';

import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import ScoringConfigRow from './scoring-config-row';

export default class PartialScoringConfig extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div className="partial-scoring-config">
      <p className="scoring-header-text">
        If there is more than one correct answer to this question, you may allow partial credit based
        on the number of correct answers submitted. This is optional.
      </p>
      <Card>
        <CardHeader title="Partial Scoring Rules" showExpandableButton={this.props.numberOfCorrectResponses > 1}/>
        <CardText expandable={true}>
          <ScoringConfigRow 
            numberOfCorrectResponses={this.props.numberOfCorrectResponses}
            partialScoring={this.props.partialScoring}
            onPartialScoringChange={this.props.onPartialScoringChange}
          />
        </CardText>
      </Card>
    </div>;
  }

}