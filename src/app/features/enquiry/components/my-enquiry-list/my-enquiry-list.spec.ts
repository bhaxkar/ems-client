import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnquiryList } from './my-enquiry-list';

describe('MyEnquiryList', () => {
  let component: MyEnquiryList;
  let fixture: ComponentFixture<MyEnquiryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEnquiryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEnquiryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
