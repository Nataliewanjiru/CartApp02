import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartitemsDetailsComponent } from './cartitems-details.component';

describe('CartitemsDetailsComponent', () => {
  let component: CartitemsDetailsComponent;
  let fixture: ComponentFixture<CartitemsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartitemsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartitemsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
