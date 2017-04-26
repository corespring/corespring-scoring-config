import React from 'react';
import * as _ from 'lodash';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import ScoringConfigRow from './scoring-config-row';

class MultiPartialScoringConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._toState(props);
  }

  _toState(props) {
    console.log('_toState');
    let { rows, partialScoring, numberOfCorrectRowResponses } = props;
    return {
      partialScoring: (partialScoring === undefined) ? rows.map(row => {
        return {
          rowId: row.id,
          scoring: []
        };
      }) : props.partialScoring
    };
  }

  _partialScoringChange(rowId, partialScoring) {
    let update = this.state.partialScoring.find((scoring) => scoring.rowId === rowId);
    update.scoring = partialScoring;
    this.props.onPartialScoringChange(this.state.partialScoring);
  }

  render() {
    let { rows, correctResponse } = this.props;
 
    let hasMultipleCorrectResponses = (rowId) => {
      return correctAnswersForRow(rowId) > 1;
    };

    let correctAnswersForRow = (rowId) => {
      return correctResponse.find(({ id }) => id === rowId).matchSet.reduce((acc, v) => acc + (v === true ? 1 : 0), 0);
    }

    let canDoScoring = rows.find(({ id }) => hasMultipleCorrectResponses(id)) !== undefined;

    return <div className="mutli-partial-scoring-config">
      <p className="scoring-header-text">
        If there is more than one correct answer per row, you may allow partial credit based on 
        the number of correct answers submitted per row. This is optional.
      </p>
      <Card>
        <CardHeader title="Partial Scoring Rules" showExpandableButton={canDoScoring}/>
        <CardText expandable={true}>{
          this.state.partialScoring.filter(({ rowId }) => hasMultipleCorrectResponses(rowId)).map((row, index) => {
            let partialScoringChange = (partialScoring) => this._partialScoringChange(row.rowId, partialScoring);
            return <div className="row" key={`row-${index}`}>
              <div className="row-label" dangerouslySetInnerHTML={{__html: this.props.rows.find(({ id }) => id === row.rowId ).labelHtml}}></div>
              <div>
                <ScoringConfigRow 
                    numberOfCorrectResponses={correctAnswersForRow(row.rowId)}
                    partialScoring={this.state.partialScoring.find(({rowId}) => rowId === row.id)}
                    onPartialScoringChange={partialScoringChange} />
              </div>
            </div>
          })
        }</CardText>
      </Card>
    </div>;
  }

}

export default MultiPartialScoringConfig;