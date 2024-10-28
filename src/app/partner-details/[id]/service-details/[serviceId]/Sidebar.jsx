import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = ({ onSelect }) => {
  const [salonInfoServices, setSalonInfoServices] = useState([]);
  const { id, serviceId } = useParams(); // Use serviceId from the URL
  const router = useRouter();

  const fetchSalonDetails = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/salon/${id.split("-")[id.split("-").length - 1]}`,
        params: {
          customerId: 518,
          latitude: "na",
          longitude: "na",
          id: id,
        },
      });

      const services = res.data?.data?.services;
      setSalonInfoServices(services);
      // Set the default service as selected (first one in the list) if serviceId isn't in the URL
      if (services && services.length > 0 && !serviceId) {
        router.push(`/partner-details/${id}/service-details/service-${services[0].id}`);
        onSelect(services[0]);
      }
    } catch (error) {
      console.error("Error fetching salon info:", error);
    }
  };

  useEffect(() => {
    fetchSalonDetails();
  }, [id]);

  // Handle service click and change background color
  const handleServiceClick = (service) => {
    onSelect(service); // Execute the onSelect callback
    router.push(`/partner-details/${id}/service-details/service-${service.id}`); // Update URL with selected service ID
  };

  return (
    <div className="w-1/4 bg-gray-100 py-5 border-r-4 border-r-gray-200">
      {salonInfoServices?.map((service) => (
          <div
                key={service.id}
                className={`mb-2 flex cursor-pointer py-1 ${serviceId === `service-${service.id}` ? 'bg-blue-200 border-r-4 border-r-gray-400' : ''}`} // Add background and border conditionally
                onClick={() => handleServiceClick(service)} // Set service as selected on click
              >
      
          <button className="flex text-[12px]  text-center flex-col items-center w-full rounded ">
            <Image src={service?.image_url} alt="logo icon" width="50" height="50" className="rounded-full" />
            <div className="text-[12px] text-center sm:text-[16px]">
              {service.name}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
