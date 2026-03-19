import { TestBed } from '@angular/core/testing';

import { Chatrooms } from './chatrooms';

describe('Chatrooms', () => {
  let service: Chatrooms;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chatrooms);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
