import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import axios from "axios";

interface DeleteModalProps {
  isOpen: boolean;
  handleClose: () => void;
  deleteUpstreamData: Upstream | null;
  refreshUpstreams: () => void;
}

interface Upstream {
  subscriber_id: string;
  provider_id: string;
}

const DeleteUpstreamButton = ({
  isOpen: isDeleteModalOpen,
  handleClose,
  deleteUpstreamData,
  refreshUpstreams,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleOpenChangeDeleteModal = () => {
    handleClose();
  };

  const handleDeleteUpstream = () => {
    setLoading(true);

    const deleteUpstream = async () => {
      await axios
        .delete("/api/upstream/delete", {
          data: {
            subscriber_id: deleteUpstreamData?.subscriber_id.toString(),
            provider_id: deleteUpstreamData?.provider_id.toString(),
          },
        })
        .then((response) => {
          if (response.status === 201) refreshUpstreams();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
          handleClose();
        });
    };

    deleteUpstream();
  };

  return (
    <AlertDialog.Root
      open={isDeleteModalOpen}
      onOpenChange={handleOpenChangeDeleteModal}
    >
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Remove</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure?
        </AlertDialog.Description>

        <Flex gap="2" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={loading && true}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button
            variant="soft"
            color="red"
            onClick={() => handleDeleteUpstream()}
            disabled={loading && true}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteUpstreamButton;
