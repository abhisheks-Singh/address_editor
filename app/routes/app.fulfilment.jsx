import { Box, Checkbox, Select } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import "./assets/custom.css";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import  app_url  from "./assets/app_url";

export const loader = async ({ request }) => {
    try {
        const main_session = await authenticate.admin(request); 
        const session = main_session.session; 
  
        const shopDomain = session?.shop; 
        console.log("Shop Domain from fulFillment page:", shopDomain);
        // console.log("Session:", session);
        // console.log("Main Session:", main_session);
  
        if (!shopDomain) {
            throw new Response('Unauthorized', { status: 401 });
        }
  
        const backendUrl = `https://${shopDomain}/apps/proxy/settings_new`; 
  
        return { shopDomain, backendUrl, app_url}; // Return relevant data
    } catch (error) {
        console.error("Error retrieving session:", error);
        throw new Response('Internal Server Error', { status: 500 });
    }
  };

function FulfillmentPage() {

    const { shopDomain } = useLoaderData();

    

    console.log("Shop Domain:", shopDomain, 'app url ', app_url);
    

    // const app_url = 'https://optimize-zone-thousand-showtimes.trycloudflare.com'; // on shopify dev command it keep on changing


  const [currentTime, setCurrentTime] = useState("");
  const [fulfillment, setFulfillment] = useState({
    addressEditTimeLimit: false,
    onHold: false,
    partiallyFulfilled: false,
    partiallyRefunded: false,
    dailyFulfillment: {
      monday: { enabled: false, start: "00:00", end: "23:59" },
      tuesday: { enabled: false, start: "00:00", end: "23:59" },
      wednesday: { enabled: false, start: "00:00", end: "23:59" },
      thursday: { enabled: false, start: "00:00", end: "23:59" },
      friday: { enabled: false, start: "00:00", end: "23:59" },
      saturday: { enabled: false, start: "00:00", end: "23:59" },
      sunday: { enabled: false, start: "00:00", end: "23:59" },
    },
    timeLimits: {
      days: "0",
      hours: "0",
      minutes: "0",
    },
  });

  // data fetcher and updater : 

  const [loading, setLoading] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");

   // onHold Option 
   

  // options :

  const daysOptions = Array.from({ length: 31 }, (_, i) => ({
    label: i.toString(),
    value: i.toString(),
  }));

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));

  const getCurrentTimeInTimezone = (timezone) => {
    const options = {
      timeZone: timezone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  };

  const fulfillment_fetch = async () => {
    try {
        const response = await fetch(`${app_url}/api/settings_new?shop=${shopDomain}`);

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const timeLimits = data.timeLimits ?? {};  // Ensure `timeLimits` is at least an empty object

        console.log('timeLimits Settings:', timeLimits);

        setFulfillment((prevSettings) => ({
            ...prevSettings,
            addressEditTimeLimit: timeLimits.addressEditTimeLimit ?? false,
            onHold: timeLimits.onHold ?? false,
            partiallyFulfilled: timeLimits.partiallyFulfilled ?? false,
            partiallyRefunded: timeLimits.partiallyRefunded ?? false,
            dailyFulfillment: {
                monday: {
                    enabled: timeLimits.mondayEnabled ?? false,
                    start: timeLimits.mondayStart ?? "00:00",
                    end: timeLimits.mondayEnd ?? "23:59"
                },
                tuesday: {
                    enabled: timeLimits.tuesdayEnabled ?? false,
                    start: timeLimits.tuesdayStart ?? "00:00",
                    end: timeLimits.tuesdayEnd ?? "23:59"
                },
                wednesday: {
                    enabled: timeLimits.wednesdayEnabled ?? false,
                    start: timeLimits.wednesdayStart ?? "00:00",
                    end: timeLimits.wednesdayEnd ?? "23:59"
                },
                thursday: {
                    enabled: timeLimits.thursdayEnabled ?? false,
                    start: timeLimits.thursdayStart ?? "00:00",
                    end: timeLimits.thursdayEnd ?? "23:59"
                },
                friday: {
                    enabled: timeLimits.fridayEnabled ?? false,
                    start: timeLimits.fridayStart ?? "00:00",
                    end: timeLimits.fridayEnd ?? "23:59"
                },
                saturday: {
                    enabled: timeLimits.saturdayEnabled ?? false,
                    start: timeLimits.saturdayStart ?? "00:00",
                    end: timeLimits.saturdayEnd ?? "23:59"
                },
                sunday: {
                    enabled: timeLimits.sundayEnabled ?? false,
                    start: timeLimits.sundayStart ?? "00:00",
                    end: timeLimits.sundayEnd ?? "23:59"
                }
            },
            timeLimits: {
                days: timeLimits.timeLimitsDays ?? "00",
                hours: timeLimits.timeLimitsHours ?? "00",
                minutes: timeLimits.timeLimitsMinutes ?? "00",
            },
        }));
    } catch (error) {
        console.error("Error fetching design settings:", error);
    }
};


  useEffect(() => {
    const timezone = "Asia/Kolkata"; // Updated to IST
    const updateTime = () => setCurrentTime(getCurrentTimeInTimezone(timezone));

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);

    
  }, []);

  const handleCheckboxChange = (field) => (checked) => {
    setFulfillment((prev) => ({ ...prev, [field]: checked }));
  };

  const handleDayChangeCheckBox = (day) => (checked) => {
    setFulfillment((prev) => ({
      ...prev,
      dailyFulfillment: {
        ...prev.dailyFulfillment,
        [day]: {
          ...prev.dailyFulfillment[day],
          enabled: checked,
        },
      },
    }));
  };

  const handleTimeChange = (day, type) => (e) => {
    const value = e.target.value;
    setFulfillment((prev) => {
      const currentStart = prev.dailyFulfillment[day].start.split(':');
      const currentEnd = prev.dailyFulfillment[day].end.split(':');
  
      if (type === 'startHour' || type === 'startMinute') {
        const newStart = type === 'startHour' 
          ? `${value}:${currentStart[1]}` 
          : `${currentStart[0]}:${value}`;
          
        return {
          ...prev,
          dailyFulfillment: {
            ...prev.dailyFulfillment,
            [day]: { ...prev.dailyFulfillment[day], start: newStart }
          }
        };
      }
  
      if (type === 'endHour' || type === 'endMinute') {
        const newEnd = type === 'endHour' 
          ? `${value}:${currentEnd[1]}` 
          : `${currentEnd[0]}:${value}`;
          
        return {
          ...prev,
          dailyFulfillment: {
            ...prev.dailyFulfillment,
            [day]: { ...prev.dailyFulfillment[day], end: newEnd }
          }
        };
      }
      
      return prev; // Default case, should not reach here.
    });
  };

  const handleTimeLimitChange = (type) => (e) => {
    const value = e.target.value;
    setFulfillment((prev) => ({
      ...prev,
      timeLimits: { ...prev.timeLimits, [type]: value },
    }));
  };



    // handle submit fn
  const handleSubmit = async () => {
    const savedData = {
        ...fulfillment,
        shopDomain,
        dataType: 'timeLimit' 
    };
    console.log(fulfillment);
    console.log("Saved Data fulfillment page :", savedData);

    setLoading(true);
    setSuccessMessage("");
    try {
        const response = await fetch(`${app_url}/api/settings_new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(savedData)
        });
  
        if (!response.ok) {
            console.error("Failed to save settings:", await response.json());
            setSuccessMessage("Failed to save settings. Please try again.");
        } else {
            const result = await response.json();
            console.log("Saved Settings:", result);
            setSuccessMessage("Settings saved successfully!");
  
           
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000); 
        }
    } catch (error) {
        console.error(error);
        setSuccessMessage("Failed to save settings. Please try again.");
    } finally {
        
        setLoading(false);
    }
  };


  useEffect(() => {
    fulfillment_fetch(); // Fetch settings when component mounts
  }, []);


  return (
    <Box className="main-container-fulfillment bg-white">
      <Box>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            paddingTop: "15px",
          }}
        >
          Time Limit
        </h1>
        <br />
        <p className="para para-blue">
          Here you can set fulfillment time / time limit to prevent customers
          from editing an order's address after fulfillment time has passed.
          <br />
          <br />
          You can set a fixed time limit where a customer can edit the order
          within a time limit, e.g., within 2 hours of placing the order.
          <br />
          <br />
          If there are daily times when you fulfill orders, you can set those
          times here.
          <br />
          <br />
          Order edits can only be done outside fulfillment time and{" "}
          <strong>before</strong> the next fulfillment time starts if you have
          set a daily fulfillment time. See the{" "}
          <a href="https://example.com/fulfillment-timeline" target="_blank">
            fulfillment timeline explanation
          </a>{" "}
          below.
          <br />
          <br />
          If an order is created between the fulfillment time start and end on
          that day, then the order cannot be edited after creation.
          <br />
          <br />
          Current timezone: <strong>(GMT-05:00) America/New_York</strong>
          <br />
          <br />
          Current time: <strong>{currentTime}</strong>
          <br />
          <br />
          You can change the store{" "}
          <a href="https://example.com/settings/general" target="_blank">
            timezone in the store Settings &gt; General &gt; Timezone
          </a>
          , and then refresh this page.
        </p>
      </Box>

      <Box className="margin-container">
        <div>
          <h2
            style={{
              lineHeight: "1.5rem",
              fontWeight: "500",
              fontSize: "1.125rem",
            }}
          >
            Time limit for address edit after placing order
          </h2>
          <p style={{ color: "rgb(107 114 128)" }}>
            Order address can only be edited within this time limit after
            placing order, check the checkbox on the left to enable the time
            limit.
          </p>
          <li
            className="py-4 flex items-center"
            style={{
              listStyle: "none",
              marginBottom: "3rem",
              marginTop: ".5rem",
            }}
          >
            <Checkbox
              checked={fulfillment.addressEditTimeLimit}
              onChange={handleCheckboxChange("addressEditTimeLimit")}
              class="checkbox-time-limit"
            />
            <Box class="flex flex-row items-center">
              <Box class="max-width">
                <select
                  value={fulfillment.timeLimits.days}
                  onChange={handleTimeLimitChange("days")}
                  className="select-time-limit"
                >
                  {daysOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Box>
              <p class="ml-2 text-sm font-medium text-gray-900 mr-4">Days</p>
              <Box class="max-width">
                <select
                  value={fulfillment.dailyFulfillment.hour}
                  onChange={handleTimeLimitChange("hours")}
                  className="select-time-limit"
                >
                  {hourOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Box>
              <p class="ml-2 text-sm font-medium text-gray-900 mr-4">Hours</p>
              <Box class="max-width">
                <select
                  value={fulfillment.timeLimits.minutes}
                  onChange={handleTimeLimitChange("minutes")}
                  className="select-time-limit"
                >
                  {minuteOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Box>
              <p class="ml-2 text-sm font-medium text-gray-900 mr-4">Minutes</p>
            </Box>
          </li>

          <h2
            style={{
              lineHeight: "1.5rem",
              fontWeight: "500",
              fontSize: "1.125rem",
            }}
          >
            Daily Fulfillment Time
          </h2>
          <p style={{ color: "rgb(107 114 128)", marginBottom: "20px" }}>
            In 24 hours format, check the checkbox on the left to enable
            fulfillment time on that day.
          </p>

          <Box>
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day, index) => (
              <div
                className="day-container"
                key={day}
                style={{ marginBottom: index === 6 ? "0" : "1rem" }}
              >
                <Box className="time-containers flex">
                  <Checkbox
                    checked={fulfillment.dailyFulfillment[day].enabled}
                    onChange={handleDayChangeCheckBox(day)}
                    className="checkbox-time-limit abhishek"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900 mr-4 name-span">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </span>
                  <Box>
                    <Box className="flex flex-row items-center time-boxes">
                      {/* Start Hour */}
                      <Box className="max-width">
                        <select
                          value={
                            fulfillment.dailyFulfillment[day].start.split(
                              ":",
                            )[0]
                          } // Get hour
                          onChange={handleTimeChange(day, "startHour")}
                          className="select-time-limit"
                        >
                          {hourOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Box>
                      <span className="mr-2">:</span>
                      {/* Start Minute */}
                      <Box className="max-width">
                        <select
                          value={
                            fulfillment.dailyFulfillment[day].start.split(
                              ":",
                            )[1]
                          } // Get minute
                          onChange={handleTimeChange(day, "startMinute")}
                          className="select-time-limit"
                        >
                          {minuteOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Box>
                      <span className="mr-2">to</span>
                      {/* End Hour */}
                      <Box className="max-width">
                        <select
                          value={
                            fulfillment.dailyFulfillment[day].end.split(":")[0]
                          } // Get hour
                          onChange={handleTimeChange(day, "endHour")}
                          className="select-time-limit"
                        >
                          {hourOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Box>
                      <span className="mr-2">:</span>
                      {/* End Minute */}
                      <Box className="max-width">
                        <select
                          value={
                            fulfillment.dailyFulfillment[day].end.split(":")[1]
                          } // Get minute
                          onChange={handleTimeChange(day, "endMinute")}
                          className="select-time-limit"
                        >
                          {minuteOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {index < 6 && (
                  <hr
                    className="day-divider"
                    style={{
                      margin: "20px 0px 5px 0px",
                      width: "97%",
                      borderColor: "#e5e7eb",
                    }}
                  />
                )}
              </div>
            ))}
          </Box>
        </div>

        <Box class="on-hold-section section-margin">
          <h2
            style={{
              lineHeight: "1.5rem",
              fontWeight: "500",
              fontSize: "1.125rem",
            }}
          >
            Set order fulfillments to "ON HOLD" if customers has updated
            province / state / country
          </h2>
          <p style={{ color: "rgb(107 114 128)" }}>
            Enabling this option will set the order fulfillments status to "ON
            HOLD" if customers has updated the province / state or country of
            the shipping address of the order.
          </p>
          <Box
            class="flex mb-12 mt-2 py-4 items-center"
            style={{ gap: "20px" }}
          >
            <Checkbox
              checked={fulfillment.onHold}
              onChange={handleCheckboxChange("onHold")}
              class="checkbox-time-limit"
            />
            <h2 style={{ fontWeight: "500", fontSize: "16px" }}>
              Hold orders when province / state / country is changed by
              customers
            </h2>
          </Box>
        </Box>

        <Box class="partially-fulfilled-section section-margin">
          <h2
            style={{
              lineHeight: "1.5rem",
              fontWeight: "500",
              fontSize: "1.125rem",
            }}
          >
            Allow Editing of partially fulfilled orders
          </h2>
          <p style={{ color: "rgb(107 114 128)" }}>
            Enabling this option will allow customers to edit shipping address
            for partially fulfilled orders (as marked by Shopify). <br />
            <br />
            If you have set and enabled fulfillment times above, the order will
            still follow the timing and will not be allowed to edit after the
            fulfillment time has passed.
          </p>
          <Box
            class="flex mb-12 mt-2 py-4 items-center"
            style={{ gap: "20px" }}
          >
            <Checkbox
              checked={fulfillment.partiallyFulfilled}
              onChange={handleCheckboxChange("partiallyFulfilled")}
              class="checkbox-time-limit"
            />
            <h2 style={{ fontWeight: "500", fontSize: "16px" }}>
              Enable shipping address edit for partially fulfilled order
            </h2>
          </Box>
        </Box>

        <Box class="partially-refunded-section section-margin">
          <h2
            style={{
              lineHeight: "1.5rem",
              fontWeight: "500",
              fontSize: "1.125rem",
            }}
          >
            Allow Editing of partially refunded orders
          </h2>
          <p style={{ color: "rgb(107 114 128)" }}>
            Enabling this option will allow customers to edit shipping address
            for orders that has been partially refunded. <br />
            <br />
            If you have set and enabled fulfillment times above, the order will
            still follow the timing and will not be allowed to edit after the
            fulfillment time has passed.
          </p>
          <Box
            class="flex mb-12 mt-2 py-4 items-center"
            style={{ gap: "20px" }}
          >
            <Checkbox
              checked={fulfillment.partiallyRefunded}
              onChange={handleCheckboxChange("partiallyRefunded")}
              class="checkbox-time-limit"
            />
            <h2 style={{ fontWeight: "500", fontSize: "16px" }}>
              Enable shipping address edit for partially refunded order
            </h2>
          </Box>
        </Box>

        <hr
                    className="day-divider"
                    style={{
                      margin: "10px 0 5px 0",
                      width: "100%",
                      borderColor: "#e5e7eb",
                    }}
                  />

<Box
  className="button-section"
  style={{
    gap: "10px",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <button className="cancel-button">Cancel</button>
  <button className="submit-btn text-white py-2 px-4" onClick={handleSubmit}>
    Save
  </button>
</Box>

{/* Success Message Section */}
{successMessage && (
  <Box
    style={{
      marginTop: "10px",
      padding: "10px",
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      borderRadius: "4px",
      textAlign: "center",
    }}
  >
    {successMessage}
  </Box>
)}

        
        <br/> <br/> <br/>
      </Box>
    </Box>
  );
}

export default FulfillmentPage;
