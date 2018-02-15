/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'vs/css!./dashboardWidgetTab';

import { Component, Inject, Input, forwardRef, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, EventEmitter, OnChanges, AfterContentInit } from '@angular/core';
import { NgGridConfig, NgGrid, NgGridItem } from 'angular2-grid';

import { DashboardServiceInterface } from 'sql/parts/dashboard/services/dashboardServiceInterface.service';
import { TabConfig, WidgetConfig } from 'sql/parts/dashboard/common/dashboardWidget';
import { DashboardWidgetWrapper } from 'sql/parts/dashboard/common/dashboardWidgetWrapper.component';
import { subscriptionToDisposable } from 'sql/base/common/lifecycle';
import { DashboardTab } from 'sql/parts/dashboard/common/interfaces';
import { WidgetTabContent } from 'sql/parts/dashboard/tabContents/widgetTabContent.component';

import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import { ConfigurationTarget } from 'vs/platform/configuration/common/configuration';
import * as objects from 'vs/base/common/objects';
import Event, { Emitter } from 'vs/base/common/event';

@Component({
	selector: 'dashboard-widget-tab',
	providers: [{ provide: DashboardTab, useExisting: forwardRef(() => DashboardWidgetTab) }],
	template: `
		<widget-tab-content [widgets]="widgets" [originalConfig]="tab.originalConfig" [context]="tab.context">
		</widget-tab-content>
	`
})
export class DashboardWidgetTab extends DashboardTab implements OnDestroy, OnChanges, AfterContentInit {
	@Input() private tab: TabConfig;
	private widgets: WidgetConfig[];
	private _onResize = new Emitter<void>();
	public readonly onResize: Event<void> = this._onResize.event;

	@ViewChild(WidgetTabContent) private _widgetTabContent: WidgetTabContent;
	constructor(
		@Inject(forwardRef(() => ChangeDetectorRef)) protected _cd: ChangeDetectorRef
	) {
		super();
	}

	ngOnChanges() {
		if (this.tab.content) {
			this.widgets = Object.values(this.tab.content)[0];
			this._cd.detectChanges();
		}
	}

	ngAfterContentInit(): void {
		this._register(this._widgetTabContent.onResize(() => {
			this._onResize.fire();
		}));
	}

	ngOnDestroy() {
		this.dispose();
	}

	public get id(): string {
		return this.tab.id;
	}

	public get editable(): boolean {
		return this.tab.editable;
	}

	public layout() {
		this._widgetTabContent.layout();
	}

	public refresh(): void {
		this._widgetTabContent.layout();
	}

	public enableEdit(): void {
		this._widgetTabContent.enableEdit();
	}
}