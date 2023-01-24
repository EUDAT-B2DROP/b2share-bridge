<?php
/**
 * b2sharebridge
 *
 * This file is licensed under the MIT License. See the LICENSE file.
 *
 * @author    Dennis Blommesteijn <dennis@blommesteijn.com>
 * @copyright Dennis Blommesteijn 2015
 */

namespace OCA\B2shareBridge\Controller;

use OCA\B2shareBridge\Model\DepositStatus;
use OCA\B2shareBridge\Model\DepositStatusMapper;
use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http;

class ViewControllerTest extends TestCase
{

    private ViewController $controller;
    private string $userId = 'john';

    private $statusCodes;

    private $request;

    private array $data;
    private $deposit_mapper;

    public function setUp(): void
    {
        parent::setUp();
        $this->request = $this->getMockBuilder('OCP\IRequest')->getMock();
        $config = $this->getMockBuilder('OCP\IConfig')->getMock();
        $this->deposit_mapper = $this->getMockBuilder('OCA\B2shareBridge\Model\DepositStatusMapper')
            ->setMethods(['findAllForUser', 'findAllForUserAndStateString'])
            ->disableOriginalConstructor()
            ->getMock();
        $deposit_file_mapper =
            $this->getMockBuilder('OCA\B2shareBridge\Model\DepositFileMapper')
                ->disableOriginalConstructor()
                ->getMock();
        $community_mapper = $this->getMockBuilder('OCA\B2shareBridge\Model\CommunityMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $server_mapper = $this->getMockBuilder('OCA\B2shareBridge\Model\ServerMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->statusCodes = $this->getMockBuilder('OCA\B2shareBridge\Model\StatusCodes')
            ->getMock();

        $this->data = [
            $this->createDepositStatus($this->userId, 0, "dep1", 1),//published
            $this->createDepositStatus($this->userId, 1, "dep2", 2),//pending
            $this->createDepositStatus($this->userId, 2, "dep3", 1),//pending
            $this->createDepositStatus($this->userId, 3, "dep4", 2),//failed
            $this->createDepositStatus($this->userId, 4, "dep5", 1),//failed
            $this->createDepositStatus($this->userId, 5, "dep6", 2),//failed
        ];

        $this->deposit_mapper->method('findAllForUser')
            ->willReturn($this->data);

        $this->controller = new ViewController(
            'b2sharebridge', $this->request, $config, $this->deposit_mapper,
            $deposit_file_mapper, $community_mapper, $server_mapper,
            $this->statusCodes, $this->userId
        );
    }

    public function createDepositStatus($owner, $status, $title, $serverId): DepositStatus
    {
        $fcStatus = new DepositStatus();
        $fcStatus->setOwner($owner);
        $fcStatus->setStatus($status);
        $fcStatus->setCreatedAt(time());
        $fcStatus->setUpdatedAt(time());
        $fcStatus->setTitle($title);
        $fcStatus->setServerId($serverId);
        return $fcStatus;
    }

    public function setFilter($filter)
    {
        if ($filter === null) {
            $this->request->method('getParams')
                ->willReturn([]);
            $this->deposit_mapper->method('findAllForUserAndStateString')
                ->willReturn([]);
            return;
        }
        $this->request->method('getParams')
            ->willReturn(["filter" => $filter]);

        $filtered_data = array_filter($this->data, function (DepositStatus $entity) use ($filter) {
            return in_array($entity->getStatus(), $this->deposit_mapper->mapFilterToStates($filter));
        });

        $this->deposit_mapper->method('findAllForUserAndStateString')
            ->willReturn($filtered_data);
    }

    public function createDeposit($filter): DataResponse
    {
        $this->setFilter($filter);
        return $this->controller->depositList();
    }

    public function testList()
    {
        $filter = 'all';
        $result = $this->createDeposit($filter);
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
        $this->assertEquals($this->data, $result->getData());
    }

    public function testPublished()
    {
        $filter = 'published';
        $result = $this->createDeposit($filter);
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
        $this->assertEquals([$this->data[0]], $result->getData());
    }

    public function testPending()
    {
        $filter = 'pending';
        $result = $this->createDeposit($filter);
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
        $this->assertEquals([$this->data[1], $this->data[2]], $result->getData());
    }

    public function testFailed()
    {
        $filter = 'failed';
        $result = $this->createDeposit($filter);
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
        $this->assertEquals([$this->data[3], $this->data[4], $this->data[5]], $result->getData());
    }

    public function testNoFilter()
    {
        $filter = null;
        $result = $this->createDeposit($filter);
        $this->assertEquals(Http::STATUS_INTERNAL_SERVER_ERROR, $result->getStatus());
    }
}
