import React, {SyntheticEvent} from "react";
import {RangeCalendarScheduleConsumer, RangeCalendarScheduleProvider} from "./RangeCalendarScheduleContextVirtualized";
import {RangeCalendarScheduleVirtualizedInitialInterface} from "../../common/interfaces";
import {AutoSizer, ScrollSync} from 'react-virtualized';
import {useScrollContainer} from 'react-indiana-drag-scroll';

import './ScrollSync.example.css';
import './range-calendar-schedule-virtualized.scss';
import _ from "lodash";
import {
    RangeCalendarScheduleCategoryVirtualized
} from "./RangeCalendarScheduleCategoryVirtualized/RangeCalendarScheduleCategoryVirtualized";

export const RangeCalendarScheduleVirtualized: React.FC<RangeCalendarScheduleVirtualizedInitialInterface> = (props) => {

    const scrollContainer = useScrollContainer({
        mouseScroll: {
            ignoreElements: '.LeftSideGridContainer,.GridTitle',
            rubberBand: false,
        }
    });

    return (
        <div className='imamaad-range-calendar-schedule-virtualized' style={{height: '100%'}}>
            <AutoSizer>
                {({width, height}) => (
                    <ScrollSync>
                        {({
                              clientHeight,
                              clientWidth,
                              onScroll,
                              scrollHeight,
                              scrollLeft,
                              scrollTop,
                              scrollWidth,
                          }) => {

                            return (
                                <RangeCalendarScheduleProvider
                                    initialProps={{
                                        width,
                                        height,
                                        scrollLeft,
                                        scrollTop,
                                        scrollHeight,
                                        clientHeight,
                                        clientWidth,
                                        scrollWidth,
                                        ...props,
                                    }}
                                >
                                    <RangeCalendarScheduleConsumer>
                                        {({categories, headerHeight, rowHeight, getRowCount}) => (
                                            <div
                                                ref={scrollContainer.ref}
                                                style={{width, height, overflow: 'auto'}}
                                                onScroll={(event: SyntheticEvent<HTMLDivElement>) => {
                                                    const {
                                                        clientHeight,
                                                        clientWidth,
                                                        scrollHeight,
                                                        scrollLeft,
                                                        scrollTop,
                                                        scrollWidth
                                                    } = event.currentTarget;

                                                    onScroll({
                                                        clientHeight,
                                                        clientWidth,
                                                        scrollHeight,
                                                        scrollLeft,
                                                        scrollTop,
                                                        scrollWidth
                                                    })
                                                }}
                                            >
                                                {_.map(categories, (category, categoryIndex) => {
                                                    return (
                                                        <RangeCalendarScheduleCategoryVirtualized
                                                            key={categoryIndex}
                                                            categoryIndex={categoryIndex}
                                                            category={category}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </RangeCalendarScheduleConsumer>
                                </RangeCalendarScheduleProvider>
                            );
                        }}
                    </ScrollSync>
                )}
            </AutoSizer>
        </div>
    )
}