import * as dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { testsTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import ThemedSuspense from "../ThemedSuspense";
const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

function Tests({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    result_awaited: 0,
    test_discarded: 0,
    total_patients: 0,
    result_negative: 0,
    result_positive: 0,
  };

  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
    ["Tests", date, auth.token, filterDistrict.id],
    (url, date, token, district) =>
      careSummary(
        token,
        "tests",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );

  const facilities = data.results.map(({ data, facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    ...data,
    id: facility.id,
    facilityType: facility.facility_type || "Unknown",
    location: facility.location,
    modifiedDate: data.modified_date,
  }));
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      Object.keys(testsTypes).forEach((k) => {
        a[key][k] += c[k];
        a[key][k] += c[k];
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );

  const { count, patients } = useSpring({
    from: { count: 0, patients: 0 },
    to: {
      count: facilitiesTrivia.current.count || 0,
      patients: facilitiesTrivia.current.total_patients || 0,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <>
      <div className="flex flex-row justify-end h-6 mb-8 space-x-2">
        <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
          <span className="mx-2 text-sm font-medium leading-none">
            Facility Count
          </span>
          <div className="flex items-center h-full bg-purple-600 rounded-lg">
            <animated.span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium leading-5 text-white align-bottom rounded-md shadow-xs">
              {count.interpolate((x) => Math.round(x))}
            </animated.span>
          </div>
        </div>
        <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
          <span className="mx-2 text-sm font-medium leading-none">
            Patient Count
          </span>
          <div className="flex items-center h-full bg-purple-600 rounded-lg">
            <animated.span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium leading-5 text-white align-bottom rounded-md shadow-xs">
              {patients.interpolate((x) => Math.round(x))}
            </animated.span>
          </div>
        </div>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(testsTypes).map((k, i) => {
          if (k != "total_patients") {
            return (
              <InfoCard
                key={i}
                title={testsTypes[k]}
                value={facilitiesTrivia.current[k]}
                delta={
                  facilitiesTrivia.current[k] - facilitiesTrivia.previous[k]
                }
              />
            );
          }
        })}
      </div>
      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={["Name", ...Object.values(testsTypes)]}
          data={filteredFacilities.reduce((a, c) => {
            if (c.date !== dateString(date)) {
              return a;
            }
            return [
              ...a,
              [
                [c.facility_name, c.facilityType],
                ...Object.keys(testsTypes).map((i) => c[i]),
              ],
            ];
          }, [])}
        ></FacilityTable>
      </Suspense>
    </>
  );
}

export default Tests;
