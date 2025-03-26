import Skeleton from "@mui/material/Skeleton";

export default function DataTableSkeleton() {
  return (
    <tr className="text-center">
      <td className="p-2">
        <Skeleton variant="text" width={40} />
      </td>
      <td className="p-2">
        <Skeleton variant="text" width={100} />
      </td>
      <td className="p-2">
        <Skeleton variant="text" width={150} />
      </td>
      <td className="p-2">
        <Skeleton variant="rectangular" width={32} height={32} />
      </td>
      <td className="p-2">
        <Skeleton variant="text" width={60} />
      </td>
      <td className="p-2">
        <Skeleton variant="text" width={80} />
      </td>
      <td className="p-2">
        <Skeleton variant="text" width={60} />
      </td>
      <td className="p-2 flex justify-center gap-1">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </td>
    </tr>
  );
}
