import React from 'react';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { CardHeader } from 'material-ui/Card';

describe('ScoringConfigRow', () => {

  const muiTheme = getMuiTheme();
  const shallowWithContext = node => shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: React.PropTypes.object }
  });

  let scoringConfig = proxyquire('../src/scoring-config-row.jsx', {
    './scoring-config.less': {
      '@noCallThru': true
    }
  });

  let ScoringConfigRow = scoringConfig.default;
  let defaultPercent = scoringConfig.defaultPercent;

  let component;

  buildComponent = ({ partialScoring, numberOfCorrectResponses, onPartialScoringChange } = {}) => {
    component = shallowWithContext(<ScoringConfigRow
      numberOfCorrectResponses={numberOfCorrectResponses}
      partialScoring={partialScoring}
      onPartialScoringChange={onPartialScoringChange}
    />);
  };

  beforeEach(() => {
    buildComponent();
  })

  describe('initialization', () => {

    describe('with no props.partialScoring', () => {

      it('defines state.partialScoring as an array with empty object', () => {
        expect(component.state().partialScoring).to.eql([{
          correctCount: '',
          weight: ''
        }]);
      });

    });

    describe('with props.partialScoring', () => {
      let weight = 0.2;
      let correctCount = 2;

      beforeEach(() => {
        buildComponent({
          partialScoring: [
            {
              correctCount: correctCount,
              weight: weight
            }
          ]
        });
      });

      it('multiplies percentages by 100', () => {
        expect(component.state().partialScoring[0].weight).to.eql(weight * 100);
      });

      it('retains value for correctCount', () => {
        expect(component.state().partialScoring[0].correctCount).to.eql(correctCount);
      });

    });

  });

  describe('render', () => {

    describe('props.partialScoring', () => {
      describe('of length 1', () => {

        beforeEach(() => {
          buildComponent({
            partialScoring: [
              {
                correctCount: 1,
                weight: 0.2
              }
            ]
          });
        });

        it('does not render a delete button', () => {
          expect(component.find('.delete-button')).to.have.length(0);
        });

      });

      describe('of length > 1', () => {
        let partialScoring = [
          {
            correctCount: 1,
            weight: 0.25
          },
          {
            correctCount: 2,
            weight: 0.5
          }
        ];

        beforeEach(() => {
          buildComponent({
            partialScoring: partialScoring
          });
        });

        it('renders a delete button for each partial scoring scenario', () => {
          expect(component.find('.delete-button')).to.have.length(partialScoring.length);
        });

      });

    });
    
  });

  describe('delete button', () => {
    let partialScoring = [
      {
        correctCount: 1,
        weight: 0.25
      },
      {
        correctCount: 2,
        weight: 0.5
      }
    ];

    let onPartialScoringChange = sinon.spy();

    beforeEach(() => {
      buildComponent({
        partialScoring: partialScoring,
        onPartialScoringChange: onPartialScoringChange
      });
    });

    describe('clicked', () => {
      beforeEach(() => {
        component.find('.delete-button').first().simulate('click');
      });

      it('calls onPartialScoringChange without partial scoring scenario for deleted scenario', () => {
        expect(onPartialScoringChange).to.have.been.calledWith([partialScoring[1]]);
      });

    });

  });

  describe('add button', () => {
    let onPartialScoringChange = sinon.spy();

    beforeEach(() => {
      buildComponent({
        numberOfCorrectResponses: 3,
        onPartialScoringChange: onPartialScoringChange
      });
    });

    describe('clicked', () => {
      beforeEach(() => {
        component.find('.add-button').first().simulate('click');
      });

      it('calls onPartialScoringChange with scenario for default percent', () => {
        expect(onPartialScoringChange).to.have.been.calledWith([{
          correctCount: 1,
          weight: defaultPercent
        }]);
      });

    });

  });

  describe('correctCount field', () => {
    let onPartialScoringChange = sinon.spy();
    let weight = 0.2;

    beforeEach(() => {
      buildComponent({
        onPartialScoringChange: onPartialScoringChange,
        partialScoring: [
          {
            correctCount: 1,
            weight: weight
          }
        ]
      });
    });

    describe('onChange called', () => {
      let correctCount = 2;

      beforeEach(() => {
        component.find('#correct-count-0').first().props().onChange({}, correctCount.toString());
      });

      it('it calls onPartialScoringChange with correctCount value updated', () => {
        expect(onPartialScoringChange).to.have.been.calledWith([{
          correctCount: correctCount,
          weight: weight
        }]);
      });

    });

  });

  describe('weight field', () => {
    let onPartialScoringChange = sinon.spy();
    let correctCount = 1;

    beforeEach(() => {
      buildComponent({
        onPartialScoringChange: onPartialScoringChange,
        partialScoring: [
          {
            correctCount: correctCount,
            weight: 0.2
          }
        ]
      });
    });

    describe('onChange called', () => {
      let weight = 40;

      beforeEach(() => {
        component.find('#weight-0').first().props().onChange({}, weight.toString());
      });

      it('it calls onPartialScoringChange with weight value updated / 100', () => {
        expect(onPartialScoringChange).to.have.been.calledWith([{
          correctCount: correctCount,
          weight: weight / 100
        }]);
      });

    });

  });

});