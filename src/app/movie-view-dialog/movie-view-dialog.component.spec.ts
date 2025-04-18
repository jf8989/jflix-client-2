import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieViewDialogComponent } from './movie-view-dialog.component';

describe('MovieViewDialogComponent', () => {
  let component: MovieViewDialogComponent;
  let fixture: ComponentFixture<MovieViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
