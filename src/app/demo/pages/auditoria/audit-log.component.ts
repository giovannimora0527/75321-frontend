import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditLogService } from '../auditoria/service/AuditLogService';
import {  Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]})

export class AuditLogComponent implements OnInit {

  logs: any[] = [];
  filterForm: FormGroup;
  page = 0;
  size = 20;
  totalPages = 0;

  constructor(private fb: FormBuilder, private auditService: AuditLogService) {
    this.filterForm = this.fb.group({
      username: [''],
      event: [''],
      from: [''],
      to: ['']
    });
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    const filters = this.filterForm.value;
    this.auditService.getLogs(this.page, this.size, filters.username, filters.event, filters.from, filters.to)
      .subscribe(res => {
        this.logs = res.content; // 'content' porque Spring Data devuelve Page<T>
        this.totalPages = res.totalPages;
      });
  }

  onFilter() {
    this.page = 0;
    this.loadLogs();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadLogs();
  }
}
