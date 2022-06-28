import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';
import { PrevalenceFormatterPipe } from 'src/app/pipes/prevalence-formatter.pipe';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NodeComponent,
        PrevalenceFormatterPipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
