import React from 'react';
import ReactDom from 'react-dom';
import * as _ from 'lodash';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

require('./scoring-config.less');

export default class PartialScoringConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      partialScoring: _.clone(props.partialScoring)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      partialScoring: _.clone(props.partialScoring)
    });
  }

  addScoringScenario() {
    let self = this;
    function findMaxNumberOfCorrectInScoringScenarios() {
      let maxNumberOfCorrect = 0;
      _.each(self.state.partialScoring, (ps) => {
        if (ps.numberOfCorrect > maxNumberOfCorrect) {
          maxNumberOfCorrect = ps.numberOfCorrect;
        }
      });
      return maxNumberOfCorrect;
    }

    let maxNumberOfCorrect = findMaxNumberOfCorrectInScoringScenarios();
    this.state.partialScoring.push(this._makeScenario(maxNumberOfCorrect + 1, 20));
    this._updateScoring(this.state.partialScoring);
  }
  

  removeScoringScenario(index) {
    this.state.partialScoring.splice(index, 1);
    this._updateScoring(this.state.partialScoring);
  }

  onNumberOfCorrectChange(index, event) {
    let newScoring = this.state.partialScoring[index];
    try {
      newScoring.numberOfCorrect = parseFloat(event.target.value);
      this._updateScoring(this.state.partialScoring);
    } catch (e) {
      console.log('error', e);
    }
  }

  onPercentageChange(index, event) {
    let newScoring = this.state.partialScoring[index];
    try {
      newScoring.scorePercentage = parseFloat(event.target.value);
      this._updateScoring(this.state.partialScoring);
    } catch (e) {
      console.log('error', e);
    }
  }

  _updateScoring(newScoring) {
    this.setState({
      partialScoring: newScoring
    }, (state) => {
      this.props.onPartialScoringChange(newScoring);
    });
  }

  _makeScenario(numberOfCorrect, scorePercentage) {
    return {
      numberOfCorrect: numberOfCorrect,
      scorePercentage: scorePercentage
    };
  }

  render() {
    const scoringFieldStyle = {display: 'inline-block', width: '50px', margin: '10px'};
    let maxNumberOfScoringScenarios = Math.max(1, this.props.numberOfCorrectResponses - 1);
    let canAddScoringScenario = this.state.partialScoring.length < maxNumberOfScoringScenarios;
    let canRemoveScoringScenario = this.state.partialScoring.length > 1;

    return <div className="partial-scoring-config">
      <p className="scoring-header-text">
        If there is more than one correct answer to this question, you may allow partial credit based
        on the number of correct answers submitted. This is optional.
      </p>
      <Card>
        <CardHeader title="Partial Scoring Rules" showExpandableButton={this.props.numberOfCorrectResponses > 1}/>
        <CardText expandable={true}>{
            this.state.partialScoring ? (
              <ul className="scenarios">{
                this.state.partialScoring.map((scenario, index) => {
                  return <li className="scenario" key={index}>
                    If
                    <TextField id={`numberOfCorrect-${index}`} style={scoringFieldStyle}
                      min={1}
                      max={this.state.maxNumberOfScoringScenarios}
                      value={scenario.numberOfCorrect || ''}
                      onChange={this.onNumberOfCorrectChange.bind(this, index)} />
                    of correct answers is/are selected, award
                    <TextField id={`scorePercentage-${index}`} style={scoringFieldStyle}
                      min={1}
                      max={99}
                      value={scenario.scorePercentage || ''}
                      onChange={this.onPercentageChange.bind(this, index)} />
                    % of full credit.
                    {
                      (canRemoveScoringScenario) ? (
                        <IconButton onClick={this.removeScoringScenario.bind(this, index)}><ActionDelete/></IconButton>
                      ) : <div/>
                    }
                  </li>
                })
              }</ul>
            ) : <ul/>
          }
          {
            (canAddScoringScenario === true) ? (
              <div className="add-scoring-scenario">
                <RaisedButton label="Add another scenario" onClick={this.addScoringScenario.bind(this)}/>
              </div>
            ) : <div/>
          }
        </CardText>
      </Card>
    </div>;
  }

}