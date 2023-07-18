import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
  MonthlyDay,
} from "@zach.codes/react-calendar";
import { useEffect, useState } from "react";
import "@zach.codes/react-calendar/dist/calendar-tailwind.css";
import { Avatar, Heading, Tooltip } from "@chakra-ui/react";

interface DayData {
  date: Date;
  avatar: string;
  name: string;
  problems: Set<string>;
}

const avatarMap: {[key: string]: string} = {
  apkirito: "/aaron.jpg",
  palak: "/palak.PNG",
};

export default function Home() {
  const { data: profiles } = api.example.getUserProfiles.useQuery();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [profileData, setProfileData] = useState<DayData[]>([]);

  useEffect(() => {
    const sampleData: DayData[] = [];
    if (profiles) {
      const dateMap: { [key: string]: Set<string> } = {};
      profiles.profiles.forEach((profile) => {
        const username = profile.matchedUser?.username;
        if (!username) {
          return;
        }
        const avatar = avatarMap[username];
        if (!profile.recentSubmissionList || !avatar) {
          return;
        }
        profile.recentSubmissionList.forEach((submission) => {
          const timestamp = parseInt(submission.timestamp);
          const date = new Date(timestamp * 1000).toISOString().split("T")[0];
          if (date) {
            if (dateMap[date] == undefined) {
              dateMap[date] = new Set();
            }
            dateMap[date]?.add(submission.title);
          }
        });
        console.log(dateMap);
        Object.keys(dateMap).forEach((date) => {
          const entry: DayData = {
            date: new Date(date),
            avatar: avatar,
            name: username,
            problems: dateMap[date] || new Set(),
          };
          sampleData.push(entry);
        });
      });
    }

    if (sampleData) {
      setProfileData(sampleData);
    }
  }, [profiles]);

  return (
    <>
      <Head>
        <title>Debt Collector</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen scale-75">
        <MonthlyCalendar
          currentMonth={currentMonth}
          onCurrentMonthChange={(date) => setCurrentMonth(date)}
        >
          <MonthlyBody events={profileData}>
            <MonthlyDay<DayData>
              renderDay={(data) => {
                const losers = new Set(Object.keys(avatarMap));
                data.forEach((data) => {
                  losers.delete(data.name);
                });

                let text = "";
                let color = "";
                // Everyone did their work
                if (losers.size == 0) {
                  text = "Tie!";
                } else if (losers.size == Object.keys(avatarMap).length) {
                  text = "Yall Suck!";
                  color = "bg-red-200"
                } else {
                  text = `${[...losers]
                    .map((s) => capitalizeFirstLetter(s))
                    .join(", ")} Lost!`;
                  color = "bg-green-200"
                }

                if (avatarMap)
                  return (
                    <div className={`${color} rounded-lg`}>
                      <Heading className="mb-3 text-center">{text}</Heading>
                      {data.map((item, index) => (
                        <div className="mx-3 inline-flex" key={index}>
                          <Tooltip
                            label={`${capitalizeFirstLetter(item.name)} Attempted ${item.problems.size} Problems!`}
                          >
                            <Avatar size="lg" name="Person" src={item.avatar} />
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  );
              }}
            />
          </MonthlyBody>
        </MonthlyCalendar>
      </div>
    </>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
