import { PrevalenceFormatterPipe } from './prevalence-formatter.pipe';

describe('PrevalenceFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe).toBeTruthy();
  });

  it('return "0" for true zero', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(0)).toEqual('0');
  });

  it('return "<0.01" for a number less than 0.01', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(0.001111111)).toEqual('<0.01');
  });

  it('return "0.0x" for a number between 0.01 and 0.09', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(0.02222222)).toEqual('0.02');
  });

  it('return "0.xx" for a number between 0.10 and 1', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(0.2222222)).toEqual('0.22');
  });

  it('return "x.xx" for a number between 1.0 and 10', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(9.2222222)).toEqual('9.22');
  });

  it('return "xx.x" for a number between 10 and 100', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(92.222222)).toEqual('92.2');
  });

  it('return "100" for a number equal to 100', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(100)).toEqual('100');
  });

  it('return ">100" for a number greater than 100', () => {
    const pipe = new PrevalenceFormatterPipe();
    expect(pipe.transform(100.00001)).toEqual('>100');
  });

});
