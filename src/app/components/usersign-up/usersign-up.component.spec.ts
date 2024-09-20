import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersignUpComponent } from './usersign-up.component';

describe('UsersignUpComponent', () => {
  let component: UsersignUpComponent;
  let fixture: ComponentFixture<UsersignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersignUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
