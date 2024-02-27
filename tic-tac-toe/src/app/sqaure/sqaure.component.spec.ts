import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqaureComponent } from './sqaure.component';

describe('SqaureComponent', () => {
  let component: SqaureComponent;
  let fixture: ComponentFixture<SqaureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqaureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SqaureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
