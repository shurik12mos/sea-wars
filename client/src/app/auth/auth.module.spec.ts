/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import AuthModule from './auth.module';

describe('AuthModule', () => {
  let authModule;

  beforeEach(() => {
    authModule = new AuthModule();
  });

  it('should create an instance', () => {
    expect(authModule).toBeTruthy();
  })
});
