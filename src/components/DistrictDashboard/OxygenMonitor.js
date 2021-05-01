import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { TRIAGE_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";

const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// const initialFacilitiesTrivia = {
//   count: 0,
//   avg_patients_visited: 0,
//   avg_patients_referred: 0,
//   avg_patients_isolation: 0,
//   total_patients_visited: 0,
//   total_patients_referred: 0,
//   total_patients_isolation: 0,
//   avg_patients_home_quarantine: 0,
//   total_patients_home_quarantine: 0,
// };

function OxygenMonitor({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["OxygenMonitor", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "facility",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );
<<<<<<< HEAD
  const { tableData } = useMemo(() => {
=======
  const { exported, tableData } = useMemo(() => {
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
    const filtered = processFacilities(data.results, filterFacilityTypes);
    // const facilitiesTrivia = filtered.reduce(
    //   (a, c) => {
    //     const key = c.date === dateString(date) ? "current" : "previous";
    //     a[key].count += 1;
    //     Object.keys(TRIAGE_TYPES).forEach((k) => {
    //       a[key][k] += c[k];
    //       a[key][k] += c[k];
    //     });
    //     return a;
    //   },
    //   {
    //     current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    //     previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    //   }
    // );
    console.log(filtered)
    const tableData = filtered.reduce((a, c) => {
      if (c.date !== dateString(date)) {
        return a;
      }
      return [
        ...a,
        [
          [c.name, c.facilityType, c.phoneNumber],
          dayjs(c.modifiedDate).fromNow(),
<<<<<<< HEAD
          c.data.inventory,
        ],
      ];
    }, []);
  /*   const exported = {
=======
          c.oxygenCapacity,
        ],
      ];
    }, []);
    const exported = {
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
      filename: "triage_export.csv",
      data: filtered.reduce((a, c) => {
        if (c.date !== dateString(date)) {
          return a;
        }
        return [
          ...a,
          {
            "Hospital/CFLTC Name": c.name,
            "Hospital/CFLTC Address": c.address,
            "Govt/Pvt": c.facilityType.startsWith("Govt") ? "Govt" : "Pvt",
            "Hops/CFLTC":
              c.facilityType === "First Line Treatment Centre"
                ? "CFLTC"
                : "Hops",
            Mobile: c.phoneNumber,
            ...Object.keys(TRIAGE_TYPES).reduce((t, x) => {
              const y = { ...t };
              y[TRIAGE_TYPES[x]] = c[x] || 0;
              return y;
            }, {}),
          },
        ];
      }, []),
<<<<<<< HEAD
    }; */
    return {tableData };
=======
    };
    return { exported, tableData };
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
  }, [data, filterFacilityTypes]);

  return (
    <>
<<<<<<< HEAD
      {/* <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
=======
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
        <ValuePill
          title="Facility Count"
          value={facilitiesTrivia.current.count}
        />
<<<<<<< HEAD
      </div> */}
     {/*  <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
=======
      </div>
      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
        {Object.keys(TRIAGE_TYPES).map((k, i) => {
          if (k !== "total_patients") {
            return (
              <InfoCard
                key={i}
                title={TRIAGE_TYPES[k]}
                value={facilitiesTrivia.current[k]}
                delta={
                  facilitiesTrivia.current[k] - facilitiesTrivia.previous[k]
                }
              />
            );
          }
        })}
<<<<<<< HEAD
      </div> */}
=======
      </div>
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
      {console.log(tableData)}
      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={[
            "Name",
<<<<<<< HEAD
           ...OXYGEN_TYPES,
=======
            "Last Updated",
            ...[
              "Patients visited",
              "Patients referred",
              "Patients isolation",
              "Patients home quarantine",
            ],
>>>>>>> 035539e00cf23b52d39dd237d8ce0718673ecd88
          ]}
          data={tableData}
          exported={exported}
        />
      </Suspense>
    </>
  );
}

export default OxygenMonitor;