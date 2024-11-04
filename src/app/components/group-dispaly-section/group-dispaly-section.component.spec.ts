import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDispalySectionComponent } from './group-dispaly-section.component';

describe('GroupDispalySectionComponent', () => {
  let component: GroupDispalySectionComponent;
  let fixture: ComponentFixture<GroupDispalySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupDispalySectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDispalySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
