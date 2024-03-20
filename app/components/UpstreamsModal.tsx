import {
  Button,
  Dialog,
  Flex,
  Inset,
  Table,
  TableBody,
} from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteUpstreamModal from "./DeleteUpstreamModal";
import AddUpstreamModal from "./AddUpstreamModal";

interface UpstreamsModalProps {
  isOpen: boolean;
  handleClose: () => void;
  company: Company | null;
  upStreamType: string | null;
  allCompanies: Company[];
}

interface Company {
  id: string;
  name: string;
}

interface Upstream {
  subscriber_id: string;
  provider_id: string;
  company_name?: string;
}

const UpstreamsModal = ({
  isOpen: isUpstreamsModalOpen,
  handleClose,
  company,
  upStreamType,
  allCompanies,
}: UpstreamsModalProps) => {
  const [upstreams, setUpstreams] = useState<Upstream[]>([]);
  const [upStreamTypeLable, setUpStreamTypeLable] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUpstreamData, setDeleteUpstreamData] = useState<Upstream | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshUpstreams, setRefreshUpstreams] = useState(0);

  const handleOpenChangeUpstreamsModal = () => {
    handleClose();
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteUpstreamData(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteClick = ({ provider_id, subscriber_id }: Upstream) => {
    setDeleteUpstreamData({ provider_id, subscriber_id });
    openDeleteModal();
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddClick = () => {
    openAddModal();
  };

  useEffect(() => {
    setUpstreams([]);
    setUpStreamTypeLable("");
    setLoading(true);

    if (upStreamType === "provider") {
      setUpStreamTypeLable("Providers");
    } else {
      setUpStreamTypeLable("Subscribers");
    }

    const fetchCompanies = async () => {
      await axios
        .get<Upstream[]>(
          `/api/upstream/providers?company_id=${company?.id}&type=${upStreamType}&refresh={refreshUpstreams}`
        )
        .then((response) => {
          setUpstreams(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchCompanies();
  }, [company, refreshUpstreams]);

  const handlerefreshUpstreams = () => {
    setRefreshUpstreams((prev) => prev + 1);
  };

  return (
    <>
      <Dialog.Root
        open={isUpstreamsModalOpen}
        onOpenChange={handleOpenChangeUpstreamsModal}
      >
        <Dialog.Content>
          <Dialog.Title>{company?.name}</Dialog.Title>
          <Inset side="x" my="5">
            <Table.Root id="upstreams">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>
                    {upStreamTypeLable}
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="flex justify-end">
                    Actions
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <TableBody>
                {upstreams.map((upstream: Upstream) => (
                  <Table.Row
                    data-provider-id={upstream?.provider_id}
                    data-subscriber-id={upstream?.subscriber_id}
                    key={upstream?.company_name}
                  >
                    <Table.Cell>{upstream?.company_name}</Table.Cell>
                    <Table.Cell className="flex justify-end space-x-2">
                      <button
                        className="text-red-700 hover:text-red-600 transition-colors"
                        onClick={() => {
                          handleDeleteClick({
                            provider_id: upstream?.provider_id,
                            subscriber_id: upstream?.subscriber_id,
                          });
                        }}
                      >
                        Remove
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {upstreams.length === 0 && !loading && (
                  <Table.Row>
                    <Table.Cell colSpan={2} className="text-center">
                      No upstreams found
                    </Table.Cell>
                  </Table.Row>
                )}
                {loading && (
                  <Table.Row>
                    <Table.Cell colSpan={2}>
                      <Skeleton height={20} count={1} />
                    </Table.Cell>
                  </Table.Row>
                )}
              </TableBody>
            </Table.Root>
          </Inset>

          <Flex gap="2" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            <Button
              variant="soft"
              color="blue"
              onClick={() => {
                handleAddClick();
              }}
            >
              + Add {upStreamType}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <DeleteUpstreamModal
        isOpen={isDeleteModalOpen}
        handleClose={closeDeleteModal}
        deleteUpstreamData={deleteUpstreamData}
        refreshUpstreams={handlerefreshUpstreams}
      />
      <AddUpstreamModal
        isOpen={isAddModalOpen}
        handleClose={closeAddModal}
        data={{
          upStreamType: upStreamType,
          companyId: company?.id,
          companyName: company?.name,
          allCompanies: allCompanies,
          upstreams: upstreams,
        }}
        refreshUpstreams={handlerefreshUpstreams}
      />
    </>
  );
};

export default UpstreamsModal;
