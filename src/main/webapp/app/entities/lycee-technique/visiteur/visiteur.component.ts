import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILyceeTechnique } from '../lycee-technique.model';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LyceeTechniqueService } from '../service/lycee-technique.service';

@Component({
  selector: 'jhi-visiteur',
  templateUrl: './visiteur.component.html',
  styleUrls: ['./visiteur.component.scss']
})
export class VisiteurComponent implements OnInit {

  lyceeTechniques?: ILyceeTechnique[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected lyceeTechniqueService: LyceeTechniqueService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.lyceeTechniqueService
      .queryVisiteur({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(item: ILyceeTechnique): number {
    return item.id!;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber);
      }
    });
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

}
