import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsebarComponent } from './responsebar.component';

describe('ResponsebarComponent', () => {
  let component: ResponsebarComponent;
  let fixture: ComponentFixture<ResponsebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
