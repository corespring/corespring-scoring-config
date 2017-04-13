import React, { PropTypes } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import jsdom from 'jsdom';
import NumberTextField from '../src/number-text-field.jsx';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView
chai.use(sinonChai);

describe('NumberTextField', () => {

  const muiTheme = getMuiTheme();
  const shallowWithContext = node => shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: React.PropTypes.object },
  });

  describe('render', () => {
    let value = 1;
    let name = "name-of-text-field";
    let onChange, component, textField;
    let min = 1;
    let max = 10;
    let style = {
      border: '1px solid red'
    };

    describe('TextField', () => {

      beforeEach(() => {
        onChange = sinon.spy();
        component = shallowWithContext(
          <NumberTextField
            value={value}
            name={name}
            min={min}
            max={max}
            style={style}
            onChange={onChange.bind(this)}
          />);
        textField = component.find(TextField);
      });


      it('should exist', () => {
        expect(textField).to.have.length(1);
      });

      describe('props', () => {
        let props;

        beforeEach(() => {
          props = textField.first().props();
        })

        it('should contain name', () => {
          expect(props.name).to.eql(name);
        });

        it('should contain value', () => {
          expect(props.value).to.eql(value);
        });

        it('should contain style', () => {
          expect(props.style).to.eql(style);
        });

        describe('onChange', () => {
          let event = {};

          describe('called with valid string representation of int', () => {
            let value = '3';

            it('should be called with parsed int', () => {
              props.onChange(event, value);
              expect(onChange).to.have.been.calledWith(event, parseInt(value, 10));
            });

          });

          describe('called with empty string', () => {
            let value = '';

            it('should be called empty string', () => {
              props.onChange(event, value);
              expect(onChange).to.have.been.calledWith(event, value);
            });

          });

          describe('called with invalid int', () => {
            let value = 'nope';

            it('should not be called', () => {
              props.onChange(event, value);
              expect(onChange).not.to.have.been.called;
            });

          });

          describe('string int exceeds max', () => {
            let value = (max+1).toString();

            it('should be called with value of max', () => {
              props.onChange(event, value);
              expect(onChange).to.have.been.calledWith(event, max);
            });

          });

          describe('string int less than min', () => {
            let value = (min-1).toString();

            it('should be called with valie of min', () => {
              props.onChange(event, value);
              expect(onChange).to.have.been.calledWith(event, min);
            });

          })

        });

      });

    });

  });

});