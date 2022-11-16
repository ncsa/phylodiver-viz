import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TableComponent } from './table.component';
import { Table } from 'primeng/table';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let clock: jasmine.Clock;

  beforeAll(() => {
    clock = jasmine.clock().install();
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ TableComponent, Table ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('PrimeNG accepts field accessor functions', () => {
    const data = [{ a: 'abc', b: 456 }, { a: 'def', b: 456 }];
    type T = (typeof data)[number];

    const columns = [{ field: (o: T) => o.a }, { field: (o: T) => o.b }];
    const fieldSpyA = spyOn(columns[0], 'field');
    const fieldSpyB = spyOn(columns[1], 'field');

    const table = component.pTable!;
    table.value = data;
    table.columns = columns;

    table.filterGlobal('some string', 'contains');
    clock.tick(table.filterDelay);

    expect(fieldSpyA).toHaveBeenCalledWith(data[0]);
    expect(fieldSpyA).toHaveBeenCalledWith(data[1]);
    expect(fieldSpyB).toHaveBeenCalledWith(data[0]);
    expect(fieldSpyB).toHaveBeenCalledWith(data[1]);
  });

});
