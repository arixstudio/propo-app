import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import axios from "axios";

interface AddModalProps {
  isOpen: boolean;
  handleClose: () => void;
  data: AddUpstreamData;
  refreshUpstreams: () => void;
}

interface AddUpstreamData {
  upStreamType?: string | null;
  companyId?: string;
  companyName?: string;
  allCompanies: Company[];
  upstreams: Upstream[];
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

interface FormData {
  provider_id: any;
  subscriber_id: any;
}

const AddUpstreamModal = ({
  isOpen: isAddModalOpen,
  handleClose,
  data,
  refreshUpstreams,
}: AddModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [formData, setFormData] = useState<FormData>({
    provider_id: "",
    subscriber_id: "",
  });

  useEffect(() => {
    if (data.upStreamType === "subscriber") {
      setFormData({ provider_id: data.companyId, subscriber_id: selectValue });
    } else {
      setFormData({ provider_id: selectValue, subscriber_id: data.companyId });
    }
  }, [selectValue, data.upStreamType]);

  const handleAddUpstream = () => {
    setLoading(true);
    const createUpstream = () => {
      axios
        .post("/api/upstream/create", {
          subscriber_id: formData.subscriber_id.toString(),
          provider_id: formData.provider_id.toString(),
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

    createUpstream();
  };

  const handleOpenChangeAddModal = () => {
    handleClose();
  };

  return (
    <Dialog.Root open={isAddModalOpen} onOpenChange={handleOpenChangeAddModal}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Add {data?.upStreamType}</Dialog.Title>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              {data.upStreamType === "subscriber" ? "Provider" : "Subscriber"}
            </Text>
            <TextField.Input value={data.companyName} disabled />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              {data.upStreamType === "subscriber" ? "Subscriber" : "Provider"}
            </Text>
            <Select.Root value={selectValue} onValueChange={setSelectValue}>
              <Select.Trigger
                className="w-full"
                placeholder="Select a company"
              />
              <Select.Content>
                <Select.Group>
                  {data.allCompanies.map((company) => (
                    <Select.Item
                      key={company.id}
                      value={company.id}
                      disabled={data.companyId == company.id}
                    >
                      {company.name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </label>
        </Flex>

        <Flex gap="2" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={loading}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            variant="soft"
            color="blue"
            onClick={() => handleAddUpstream()}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddUpstreamModal;
