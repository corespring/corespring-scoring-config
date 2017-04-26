import React from 'react';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Decimal from 'decimal.js';

import NumberTextField from './number-text-field';

require('./scoring-config.less');

export const defaultPercent = 0.2;

export default class ScoringConfigRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._toState(props);
  }

  _toState(props) {
    return {
      partialScoring: (props.partialScoring === undefined) ? [
        {
          correctCount: '',
          weight: ''
        }
      ] : props.partialScoring.map(({ correctCount, weight }) => {
        return {
          correctCount: correctCount,
          weight: new Decimal(weight).mul(100).toNumber()
        };
      })
    };
  }

  _fromState(partialScoring) {
    return partialScoring.filter((partialScoring) => !this._isInProgress(partialScoring)).map((partialScoring) => {
      return {
        correctCount: partialScoring.correctCount,
        weight: new Decimal(partialScoring.weight).div(100).toNumber()
      };
    });
  }

  _isInProgress({ correctCount, weight }) {
    return correctCount === '' || weight === '';
  }

  addScoringScenario() {
    let self = this;
    function findMaxcorrectCountInScoringScenarios() {
      let maxcorrectCount = 0;
      _.each(self.state.partialScoring, (ps) => {
        if (ps.correctCount > maxcorrectCount) {
          maxcorrectCount = ps.correctCount;
        }
      });
      return maxcorrectCount;
    }

    let maxcorrectCount = findMaxcorrectCountInScoringScenarios();
    this.state.partialScoring.push(this._makeScenario(maxcorrectCount + 1, defaultPercent * 100));
    this._updateScoring(this.state.partialScoring);
  }
  

  removeScoringScenario(index) {
    this.state.partialScoring.splice(index, 1);
    this._updateScoring(this.state.partialScoring);
  }

  _updateScoring(newScoring) {
    this.props.onPartialScoringChange(this._fromState(newScoring));
  }

  _makeScenario(correctCount, weight) {
    return {
      correctCount: correctCount,
      weight: weight
    };
  }

  _onUpdate(index, value, key) {
    let update = _.cloneDeep(this.state.partialScoring);
    let newScoring = update[index];
    this.state.partialScoring[index][key] = value;
    try {
      if (value === '') {
        update.splice(index, 1);
      } else {
        newScoring[key] = parseFloat(value);
      }
      this._updateScoring(update);
    } catch (e) {
      console.log('error', e);
    }
  }

  onNumberOfCorrectChange(index, event, value) {
    this._onUpdate(index, value, 'correctCount');
  }

  onPercentageChange(index, event, value) {
    this._onUpdate(index, value, 'weight');
  }

  render() {
    const scoringFieldStyle = {display: 'inline-block', width: '50px', margin: '10px'};

    let maxNumberOfScoringScenarios = Math.max(1, this.props.numberOfCorrectResponses - 1);
    let canRemoveScoringScenario = this.state.partialScoring.length > 1;
    let canAddScoringScenario = this.state.partialScoring.length < maxNumberOfScoringScenarios;

    return (
      <div>
        { this.state.partialScoring ? (
          <ul className="scenarios">{
            this.state.partialScoring.map((scenario, index) => {
              return <li className="scenario" key={index}>
                If
                <NumberTextField id={`correct-count-${index}`} style={scoringFieldStyle}
                  min={1}
                  name={`correct-count-${index}`}
                  max={maxNumberOfScoringScenarios}
                  value={scenario.correctCount}
                  onChange={this.onNumberOfCorrectChange.bind(this, index)} />
                of correct answers is/are selected, award
                <NumberTextField id={`weight-${index}`} style={scoringFieldStyle}
                  min={1}
                  name={`weight-${index}`}
                  max={99}
                  value={scenario.weight}
                  onChange={this.onPercentageChange.bind(this, index)} />
                % of full credit.
                {
                  (canRemoveScoringScenario) ? (
                    <IconButton className="delete-button" onClick={this.removeScoringScenario.bind(this, index)}><ActionDelete/></IconButton>
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
              <RaisedButton className="add-button" label="Add another scenario" onClick={this.addScoringScenario.bind(this)}/>
            </div>
          ) : <div/>
        }
      </div>
    );     
  }

}