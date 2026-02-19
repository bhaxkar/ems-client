import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEnquiry } from './submit-enquiry';

describe('SubmitEnquiry', () => {
  let component: SubmitEnquiry;
  let fixture: ComponentFixture<SubmitEnquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitEnquiry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitEnquiry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
